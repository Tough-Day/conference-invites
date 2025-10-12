import { Router } from 'express';
import { prisma } from '../db.js';
import { convertToCSV, exportToHubSpot } from '../utils/export.js';

export const submissionRouter = Router();

// Get submissions for a conference
submissionRouter.get('/conference/:conferenceId', async (req, res) => {
  try {
    const { conferenceId } = req.params;
    const { limit, offset } = req.query;

    const submissions = await prisma.submission.findMany({
      where: { conferenceId },
      orderBy: { submittedAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined
    });

    const total = await prisma.submission.count({
      where: { conferenceId }
    });

    res.json({
      submissions,
      total,
      limit: limit ? parseInt(limit as string) : total,
      offset: offset ? parseInt(offset as string) : 0
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Create new submission (public endpoint)
submissionRouter.post('/', async (req, res) => {
  try {
    const { conferenceId, formData } = req.body;

    // Validate conference exists
    const conference = await prisma.conference.findUnique({
      where: { id: conferenceId },
      include: { formFields: true }
    });

    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    if (!conference.isActive) {
      return res.status(400).json({ error: 'This conference is no longer accepting submissions' });
    }

    // Validate required fields (only check active fields)
    const requiredFields = conference.formFields.filter(f => f.required && f.isActive !== false);
    const missingFields = requiredFields.filter(f => !formData[f.fieldName]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields.map(f => f.fieldName)
      });
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        conferenceId,
        formData,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    // Track submission event
    await prisma.analytics.create({
      data: {
        conferenceId,
        eventType: 'FORM_SUBMIT'
      }
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Export submissions as CSV
submissionRouter.get('/conference/:conferenceId/export/csv', async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const submissions = await prisma.submission.findMany({
      where: { conferenceId },
      orderBy: { submittedAt: 'desc' }
    });

    const csv = convertToCSV(submissions);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="submissions-${conferenceId}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// Export submissions to HubSpot
submissionRouter.post('/conference/:conferenceId/export/hubspot', async (req, res) => {
  try {
    const { conferenceId } = req.params;

    const submissions = await prisma.submission.findMany({
      where: { conferenceId },
      orderBy: { submittedAt: 'desc' }
    });

    await exportToHubSpot(submissions);

    res.json({ message: `Successfully exported ${submissions.length} submissions to HubSpot` });
  } catch (error) {
    console.error('Error exporting to HubSpot:', error);
    res.status(500).json({ error: 'Failed to export to HubSpot' });
  }
});

// Delete submission
submissionRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.submission.delete({
      where: { id }
    });
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});
