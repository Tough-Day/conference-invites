import { Router } from 'express';
import { prisma } from '../db.js';
import { EventType } from '@prisma/client';

export const analyticsRouter = Router();

// Track an event (page view, QR scan, etc.)
analyticsRouter.post('/track', async (req, res) => {
  try {
    const { conferenceId, eventType, metadata } = req.body;

    console.log(`[Analytics] Tracking event: ${eventType} for conference: ${conferenceId}`, metadata ? `with metadata: ${JSON.stringify(metadata)}` : '');

    if (eventType === 'QR_SCAN') {
      console.log(`[Analytics] 🎯 QR CODE SCAN DETECTED for conference: ${conferenceId}`);
    }

    const event = await prisma.analytics.create({
      data: {
        conferenceId,
        eventType: eventType as EventType,
        metadata
      }
    });

    console.log(`[Analytics] Event tracked successfully: ${event.id} (${eventType})`);
    res.status(201).json(event);
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Get analytics for a conference
analyticsRouter.get('/conference/:conferenceId', async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    // Get event counts by type
    const eventCounts = await prisma.analytics.groupBy({
      by: ['eventType'],
      where: {
        conferenceId,
        ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter })
      },
      _count: {
        eventType: true
      }
    });

    // Get submission count
    const submissionCount = await prisma.submission.count({
      where: {
        conferenceId,
        ...(Object.keys(dateFilter).length > 0 && { submittedAt: dateFilter })
      }
    });

    // Get timeline data (events by day)
    let timeline;
    if (Object.keys(dateFilter).length > 0) {
      const startTime = dateFilter.gte || new Date(0);
      const endTime = dateFilter.lte || new Date();
      timeline = await prisma.$queryRaw`
        SELECT
          DATE(timestamp) as date,
          "eventType"::text as event_type,
          COUNT(*) as count
        FROM analytics
        WHERE "conferenceId" = ${conferenceId}
        AND timestamp >= ${startTime}
        AND timestamp <= ${endTime}
        GROUP BY DATE(timestamp), "eventType"
        ORDER BY date DESC
        LIMIT 30
      `;
    } else {
      timeline = await prisma.$queryRaw`
        SELECT
          DATE(timestamp) as date,
          "eventType"::text as event_type,
          COUNT(*) as count
        FROM analytics
        WHERE "conferenceId" = ${conferenceId}
        GROUP BY DATE(timestamp), "eventType"
        ORDER BY date DESC
        LIMIT 30
      `;
    }

    // Convert BigInt values to numbers for JSON serialization
    const timelineConverted = (timeline as any[]).map((row: any) => ({
      date: row.date,
      event_type: row.event_type,
      count: Number(row.count)
    }));

    res.json({
      eventCounts,
      submissionCount,
      timeline: timelineConverted,
      summary: {
        pageViews: eventCounts.find(e => e.eventType === 'PAGE_VIEW')?._count.eventType || 0,
        qrScans: eventCounts.find(e => e.eventType === 'QR_SCAN')?._count.eventType || 0,
        submissions: submissionCount,
        conversionRate: eventCounts.find(e => e.eventType === 'PAGE_VIEW')?._count.eventType
          ? ((submissionCount / (eventCounts.find(e => e.eventType === 'PAGE_VIEW')?._count.eventType || 1)) * 100).toFixed(2)
          : '0.00'
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get overall stats across all conferences
analyticsRouter.get('/overview', async (req, res) => {
  try {
    const totalConferences = await prisma.conference.count();
    const totalSubmissions = await prisma.submission.count();
    const totalPageViews = await prisma.analytics.count({
      where: { eventType: 'PAGE_VIEW' }
    });

    const recentSubmissions = await prisma.submission.findMany({
      take: 10,
      orderBy: { submittedAt: 'desc' },
      include: {
        conference: {
          select: { name: true, slug: true }
        }
      }
    });

    res.json({
      totalConferences,
      totalSubmissions,
      totalPageViews,
      recentSubmissions
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});
