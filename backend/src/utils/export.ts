import { Submission } from '@prisma/client';

// CSV Export Utility
export function convertToCSV(submissions: Submission[]): string {
  if (submissions.length === 0) {
    return '';
  }

  // Extract all unique field names from form data
  const allFields = new Set<string>();
  submissions.forEach(sub => {
    const formData = sub.formData as Record<string, any>;
    Object.keys(formData).forEach(key => allFields.add(key));
  });

  // Create header row
  const headers = ['ID', 'Submitted At', ...Array.from(allFields)];
  const csvRows: string[] = [headers.join(',')];

  // Add data rows
  submissions.forEach(sub => {
    const formData = sub.formData as Record<string, any>;
    const row = [
      sub.id,
      sub.submittedAt.toISOString(),
      ...Array.from(allFields).map(field => {
        const value = formData[field] || '';
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      })
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

// HubSpot Integration
interface HubSpotContact {
  properties: Record<string, string>;
}

export async function exportToHubSpot(submissions: Submission[]): Promise<void> {
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!apiKey) {
    throw new Error('HubSpot API key not configured');
  }

  const hubspotContacts: HubSpotContact[] = submissions.map(sub => {
    const formData = sub.formData as Record<string, any>;

    // Map form fields to HubSpot properties
    return {
      properties: {
        email: formData.email || '',
        firstname: formData.firstName || formData.first_name || '',
        lastname: formData.lastName || formData.last_name || '',
        company: formData.company || '',
        // Add custom properties as needed
        ...formData,
      }
    };
  });

  // Batch create contacts in HubSpot
  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/batch/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: hubspotContacts
      }),
    });

    if (!response.ok) {
      throw new Error(`HubSpot API returned ${response.status}`);
    }

    console.log(`Successfully exported ${submissions.length} contacts to HubSpot`);
  } catch (error) {
    console.error('Error exporting to HubSpot:', error);
    throw error;
  }
}
