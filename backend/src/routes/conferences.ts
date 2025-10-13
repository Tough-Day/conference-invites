import { Router } from 'express';
import { prisma } from '../db.js';
import { generateQRCode } from '../utils/qrCode.js';
import { createShortUrl } from '../utils/shortUrl.js';
import { requireAuth } from '../middleware/auth.js';

export const conferenceRouter = Router();

// Get all conferences (admin only)
conferenceRouter.get('/', requireAuth, async (req, res) => {
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

    // Transform validation to options
    const transformed = conferences.map(conf => ({
      ...conf,
      formFields: conf.formFields.map(field => {
        const validation = field.validation as any;
        return {
          ...field,
          options: validation?.options || undefined,
          validation: validation?.options ? undefined : field.validation
        };
      })
    }));

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    res.status(500).json({ error: 'Failed to fetch conferences' });
  }
});

// Get single conference by ID (admin only)
conferenceRouter.get('/id/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const conference = await prisma.conference.findUnique({
      where: { id },
      include: {
        formFields: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!conference) {
      return res.status(404).json({ error: 'Conference not found' });
    }

    // Transform validation to options
    const transformed = {
      ...conference,
      formFields: conference.formFields.map(field => {
        const validation = field.validation as any;
        return {
          ...field,
          options: validation?.options || undefined,
          validation: validation?.options ? undefined : field.validation
        };
      })
    };

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching conference:', error);
    res.status(500).json({ error: 'Failed to fetch conference' });
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

    // Transform validation to options
    const transformed = {
      ...conference,
      formFields: conference.formFields.map(field => {
        const validation = field.validation as any;
        return {
          ...field,
          options: validation?.options || undefined,
          validation: validation?.options ? undefined : field.validation
        };
      })
    };

    res.json(transformed);
  } catch (error) {
    console.error('Error fetching conference:', error);
    res.status(500).json({ error: 'Failed to fetch conference' });
  }
});

// Create new conference (admin only)
conferenceRouter.post('/', requireAuth, async (req, res) => {
  try {
    const { name, slug, description, formInstructions, logoUrl, primaryColor, formFields } = req.body;

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
        formInstructions,
        logoUrl,
        primaryColor,
        formUrl,
        shortUrl,
        isActive: true,
        formFields: {
          create: formFields.map((field: any, index: number) => ({
            fieldName: field.fieldName,
            label: field.label,
            fieldType: field.fieldType,
            placeholder: field.placeholder,
            required: field.required,
            order: index,
            validation: field.options ? { options: field.options } : field.validation
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

// Update conference (admin only)
conferenceRouter.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, formInstructions, logoUrl, primaryColor, isActive, formFields } = req.body;

    // Update conference
    const conference = await prisma.conference.update({
      where: { id },
      data: {
        name,
        description,
        formInstructions,
        logoUrl,
        primaryColor,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    // Update form fields if provided
    if (formFields) {
      // Check if conference has submissions
      const submissionCount = await prisma.submission.count({
        where: { conferenceId: id }
      });
      const hasSubmissions = submissionCount > 0;

      // Get existing fields
      const existingFields = await prisma.formField.findMany({
        where: { conferenceId: id }
      });

      if (hasSubmissions) {
        // Smart update: preserve data with field versioning
        const existingFieldMap = new Map(existingFields.map(f => [f.id, f]));
        const incomingFieldIds = new Set(formFields.filter((f: any) => f.id).map((f: any) => f.id));

        // Mark removed fields as inactive
        for (const existing of existingFields) {
          if (!incomingFieldIds.has(existing.id)) {
            await prisma.formField.update({
              where: { id: existing.id },
              data: { isActive: false }
            });
          }
        }

        // Process each incoming field
        for (let index = 0; index < formFields.length; index++) {
          const field = formFields[index];

          if (field.id && existingFieldMap.has(field.id)) {
            // Existing field - check for type change
            const existing = existingFieldMap.get(field.id)!;

            if (existing.fieldType !== field.fieldType) {
              // Type changed - create versioned field
              await prisma.formField.update({
                where: { id: existing.id },
                data: { isActive: false }
              });

              // Find next version number
              const baseName = existing.fieldName.replace(/_v\d+$/, '');
              const versionedFields = existingFields.filter(f =>
                f.fieldName.startsWith(baseName) && f.fieldName.match(/_v\d+$/)
              );
              const nextVersion = versionedFields.length + 2;
              const newFieldName = `${baseName}_v${nextVersion}`;

              await prisma.formField.create({
                data: {
                  conferenceId: id,
                  fieldName: newFieldName,
                  label: field.label,
                  fieldType: field.fieldType,
                  placeholder: field.placeholder,
                  required: field.required,
                  order: index,
                  isActive: true,
                  originalFieldId: existing.id,
                  validation: field.options ? { options: field.options } : field.validation
                }
              });
            } else {
              // No type change - update normally
              await prisma.formField.update({
                where: { id: field.id },
                data: {
                  label: field.label,
                  placeholder: field.placeholder,
                  required: field.required,
                  order: index,
                  validation: field.options ? { options: field.options } : field.validation
                }
              });
            }
          } else {
            // New field
            await prisma.formField.create({
              data: {
                conferenceId: id,
                fieldName: field.fieldName,
                label: field.label,
                fieldType: field.fieldType,
                placeholder: field.placeholder,
                required: field.required,
                order: index,
                isActive: true,
                validation: field.options ? { options: field.options } : field.validation
              }
            });
          }
        }
      } else {
        // No submissions - can safely delete and recreate
        await prisma.formField.deleteMany({
          where: { conferenceId: id }
        });

        await prisma.formField.createMany({
          data: formFields.map((field: any, index: number) => ({
            conferenceId: id,
            fieldName: field.fieldName,
            label: field.label,
            fieldType: field.fieldType,
            placeholder: field.placeholder,
            required: field.required,
            order: index,
            isActive: true,
            validation: field.options ? { options: field.options } : field.validation
          }))
        });
      }
    }

    const updated = await prisma.conference.findUnique({
      where: { id },
      include: {
        formFields: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Transform validation to options
    const transformed = {
      ...updated,
      formFields: updated!.formFields.map(field => {
        const validation = field.validation as any;
        return {
          ...field,
          options: validation?.options || undefined,
          validation: validation?.options ? undefined : field.validation
        };
      })
    };

    res.json(transformed);
  } catch (error) {
    console.error('Error updating conference:', error);
    res.status(500).json({ error: 'Failed to update conference' });
  }
});

// Delete conference (admin only)
conferenceRouter.delete('/:id', requireAuth, async (req, res) => {
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

// Generate QR code for conference (admin only)
conferenceRouter.get('/:id/qrcode', requireAuth, async (req, res) => {
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
