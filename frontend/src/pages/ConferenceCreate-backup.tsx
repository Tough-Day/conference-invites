import { Router } from 'express';
import { prisma } from '../db.js';
import { generateQRCode } from '../utils/qrCode.js';
import { createShortUrl } from '../utils/shortUrl.js';

export const conferenceRouter = Router();

// Get all conferences
conferenceRouter.get('/', async (req, res) => {
  try {
    const conferences = await prisma.conference.findMany({
      include: {
        formFields: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(conferences);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    res.status(500).json({ error: 'Failed to fetch conferences' });
  }
});

// Get single conference by slug
conferenceRouter.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const conference = await prisma.conference.findUnique({
      where: { slug },
      include: {
        formFields: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    res.json(conference);
  } catch (error) {
    console.error('Error fetching conference:', error);
    res.status(500).json({ error: 'Failed to fetch conference' });
  }
});

// Create new conference
conferenceRouter.post('/', async (req, res) => {
  try {
    const { name, slug, description, logoUrl, primaryColor, formFields } = req.body;

    // Generate form URL
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const formUrl = `${baseUrl}/form/${slug}`;

    // Create short URL
    const shortUrl = await createShortUrl(formUrl);

    // Create conference with form fields
    const conference = await prisma.conference.create({
      data: {
        name,
        slug,
        description,
        logoUrl,
        primaryColor,
        formUrl,
        shortUrl,
        formFields: {
          create: formFields.map((field: any, index: number) => ({
            fieldName: field.fieldName,
            label: field.label,
            fieldType: field.fieldType,
            placeholder: field.placeholder,
            required: field.required,
            order: index,
            validation: field.validation
          }))
        }
      },
      include: {
        formFields: true
      }
    });

    res.status(201).json(conference);
  } catch (error) {
    console.error('Error creating conference:', error);
    res.status(500).json({ error: 'Failed to create conference' });
  }
});

// Update conference
conferenceRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logoUrl, primaryColor, formFields } = req.body;

    // Update conference
    const conference = await prisma.conference.update({
      where: { id },
      data: {
        name,
        description,
        logoUrl,
        primaryColor
      }
    });

    // Update form fields if provided
    if (formFields) {
      // Delete existing fields
      await prisma.formField.deleteMany({
        where: { conferenceId: id }
      });

      // Create new fields
      await prisma.formField.createMany({
        data: formFields.map((field: any, index: number) => ({
          conferenceId: id,
          fieldName: field.fieldName,
          label: field.label,
          fieldType: field.fieldType,
          placeholder: field.placeholder,
          required: field.required,
          order: index,
          validation: field.validation
        }))
      });
    }

    const updated = await prisma.conference.findUnique({
      where: { id },
      include: {
        formFields: {
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating conference:', error);
    res.status(500).json({ error: 'Failed to update conference' });
  }
});

// Delete conference
conferenceRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.conference.delete({
      where: { id }
    });
    res.json({ message: 'Conference deleted successfully' });
  } catch (error) {
    console.error('Error deleting conference:', error);
    res.status(500).json({ error: 'Failed to delete conference' });
  }
});

// Generate QR code for conference
conferenceRouter.get('/:id/qrcode', async (req, res) => {
  try {
    const { id } = req.params;
    const conference = await prisma.conference.findUnique({
      where: { id },
      select: { shortUrl: true, formUrl: true }
    });

    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    const url = conference.shortUrl || conference.formUrl;
    if (!url) {
      return res.status(400).json({ error: 'No URL available for QR code' });
    }

    const qrCodeDataUrl = await generateQRCode(url);
    res.json({ qrCode: qrCodeDataUrl, url });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});
