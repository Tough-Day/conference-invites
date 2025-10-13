# Conference Invites Platform - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Creating Your First Event](#creating-your-first-event)
3. [Managing Form Fields](#managing-form-fields)
4. [Customizing Event Branding](#customizing-event-branding)
5. [Adding Form Instructions](#adding-form-instructions)
6. [Sharing Your Event Form](#sharing-your-event-form)
7. [Viewing Submissions](#viewing-submissions)
8. [Tracking Analytics](#tracking-analytics)
9. [Editing Events](#editing-events)
10. [Exporting Data](#exporting-data)

---

## Getting Started

Access the Conference Invites Platform at:
**https://conference-invites-frontend-615509061125.us-central1.run.app**

The dashboard displays all your events with their submission counts and status.

---

## Creating Your First Event

### Step 1: Start a New Event

1. Click the **"New Event"** button in the top-right corner of the dashboard
2. You'll be taken to a multi-step form wizard

### Step 2: Basic Information

Fill in the following details:

- **Event Name** (required)
  - Example: "Tech Conference 2025"
  - This will be displayed as the form title

- **URL Slug** (required)
  - Example: "tech-conference-2025"
  - Must be unique and URL-friendly
  - Only lowercase letters, numbers, and hyphens
  - Cannot be changed after creation
  - Will be used in your form URL: `/form/your-slug`

- **Description** (optional)
  - Brief description of your event
  - Example: "Annual technology conference for developers"

- **Form Instructions** (optional)
  - Instructions displayed at the top of the registration form
  - Use this to guide respondents
  - Example: "Please fill out all required fields. We'll contact you within 48 hours."
  - Supports multiple paragraphs

Click **"Next: Branding"** to continue.

### Step 3: Branding (Optional)

Customize the look of your form:

- **Logo URL**
  - Enter a direct URL to your event logo
  - Example: `https://example.com/logo.png`
  - The logo will appear at the top of the form
  - Preview shows how it will look

- **Primary Color**
  - Choose your brand color
  - Use the color picker or enter a hex code
  - Example: `#0d9488` (teal)
  - Affects buttons and accents on the form

Click **"Next: Form Fields"** to continue.

### Step 4: Form Fields

Design the fields that attendees will fill out.

#### Default Fields

Every new event starts with three default fields:
- Name (text input)
- Email (text input)
- Phone (text input)

#### Adding Fields

Click **"+ Add Field"** to add more fields.

#### Field Types

Choose from four field types:

1. **Short text** - Single line text input
   - Best for: names, email, phone numbers

2. **Paragraph** - Multi-line text area
   - Best for: comments, questions, descriptions

3. **Multiple choice** - Radio buttons (select one)
   - Best for: T-shirt size, meal preference
   - Enter options (one per line)

4. **Dropdown** - Select menu (select one)
   - Best for: country selection, time slots
   - Enter options (one per line)

#### Field Configuration

For each field, set:

- **Label** - Display name (e.g., "Full Name")
- **Field Name** - Database identifier (auto-generated as slug)
- **Type** - Select from the four types above
- **Placeholder** - Hint text shown in empty field
- **Required** - Toggle to make field mandatory
- **Options** - For multiple choice/dropdown only

#### Field Actions

- **Reorder** - Drag fields by the handle icon
- **Insert below** - Add a new field after this one
- **Remove** - Delete the field (minimum 1 field required)

#### Tips for Form Fields

- Keep forms short - only ask for essential information
- Use clear, concise labels
- Provide helpful placeholder text
- Mark truly required fields only
- Group related fields together

Click **"Create Event"** when done.

---

## Managing Form Fields

### Reordering Fields

1. Click and hold the **grip icon** (⋮⋮) on the left side of any field
2. Drag the field up or down
3. Drop it in the desired position
4. Fields are automatically renumbered

### Adding Fields Between Existing Ones

1. Click **"Insert below"** on the field above where you want the new field
2. A new field will be added immediately below
3. Configure the new field as needed

### Editing Field Options

For **Multiple choice** and **Dropdown** fields:

1. Enter each option on a new line in the options text area
2. Example:
   ```
   Small
   Medium
   Large
   X-Large
   ```
3. Empty lines are automatically removed

### Removing Fields

1. Click **"Remove"** on any field
2. The field is immediately deleted
3. You cannot remove the last field - forms need at least one field

---

## Customizing Event Branding

### Adding a Logo

1. Host your logo image on a public URL
2. Common options:
   - Your website: `https://yoursite.com/logo.png`
   - Cloud storage: Google Cloud Storage, AWS S3
   - Image hosting: Imgur, ImageKit
3. Enter the full URL in the **Logo URL** field
4. Check the preview to ensure it displays correctly

**Logo Requirements:**
- Must be a public URL
- Recommended formats: PNG, JPG, SVG
- Recommended size: 200-400px wide
- Keep file size under 500KB for fast loading

### Choosing a Color

**Method 1: Color Picker**
1. Click the color square
2. Select your desired color from the picker
3. The hex code updates automatically

**Method 2: Hex Code**
1. Enter a 6-digit hex code directly
2. Example: `#FF5733`
3. Must start with `#`

**Color Tips:**
- Use your brand's primary color
- Ensure good contrast with white text
- Test readability before publishing

---

## Adding Form Instructions

Form instructions appear at the top of the registration form, before any fields.

### When to Use Instructions

- Explain the purpose of the form
- Provide important deadlines
- Clarify what happens after submission
- List any prerequisites or requirements
- Add contact information for questions

### Best Practices

**Do:**
- Keep it concise (2-3 short paragraphs max)
- Use clear, friendly language
- Include only essential information
- Add a call-to-action if appropriate

**Don't:**
- Write long blocks of text
- Duplicate information in field labels
- Use technical jargon
- Include sensitive information

### Example Instructions

```
Welcome to the Tech Conference 2025 registration!

Please complete all required fields below. We'll send a
confirmation email within 24 hours.

Registration closes on December 15, 2024. For questions,
email events@example.com.
```

---

## Sharing Your Event Form

After creating an event, you have multiple ways to share it:

### 1. Direct URL

Every event has a permanent URL:
```
https://your-frontend-url.run.app/form/your-slug
```

Share this link via:
- Email campaigns
- Social media posts
- Website buttons
- SMS messages

### 2. QR Code

Generate a QR code for physical marketing:

1. Go to your event detail page
2. Click **"Generate QR"**
3. The QR code appears in the card
4. Right-click and **"Save image as..."**
5. Print on:
   - Flyers and posters
   - Name badges
   - Table tents
   - Presentation slides

**QR Code Features:**
- High resolution for print quality
- Includes analytics tracking
- Never expires
- Tracks scans in analytics

### 3. Short URL (if configured)

If you've configured a URL shortening service:
- A short URL is automatically generated
- Displayed on the event detail page
- Easier to share verbally or in print
- Redirects to your full form URL

### Tracking Form Access

All form access methods are tracked:
- **Direct visits** - Page views from URL
- **QR scans** - Views from QR code
- **Submissions** - Completed forms

View these metrics in the Analytics section.

---

## Viewing Submissions

### Accessing Submissions

1. Go to the Dashboard
2. Click on any event card
3. Navigate to the **Submissions** tab
4. View all submissions in a table format

### Submission Table

The table displays:
- **Timestamp** - When the form was submitted
- **Field Data** - All form fields as columns
- **Actions** - Per-submission actions

### Filtering and Sorting

- **Sort** - Click column headers to sort
- **Search** - Use browser's find feature (Ctrl+F / Cmd+F)

### Submission Details

Each row shows:
- All custom fields you defined
- Exact values entered by respondent
- Date and time of submission

---

## Tracking Analytics

### Viewing Analytics

1. Open your event from the Dashboard
2. Navigate to the **Analytics** tab
3. View key metrics at a glance

### Available Metrics

**Page Views**
- Total number of times the form was loaded
- Includes both desktop and mobile
- Tracks unique and repeat visits

**QR Code Scans**
- Number of times the QR code was scanned
- Only tracked if QR code was generated
- Helps measure offline marketing effectiveness

**Form Submissions**
- Total completed and submitted forms
- Conversion rate shown as percentage
- Helps measure form effectiveness

**Conversion Rate**
- Calculated as: (Submissions / Page Views) × 100
- Example: 10 submissions from 100 views = 10%
- Helps optimize your form design

### Using Analytics

**Low page views?**
- Increase marketing efforts
- Share form in more channels
- Check if QR codes are visible

**Low conversion rate?**
- Simplify the form (fewer fields)
- Make instructions clearer
- Check mobile compatibility
- Test the form yourself

**High QR scan rate?**
- Your physical marketing is working
- Consider investing more in print materials

---

## Editing Events

### Accessing Edit Mode

1. From Dashboard, click an event
2. Click **"Edit Event"** button
3. Or click the edit icon from the dashboard

### Editing Tabs

**Event Info Tab**
- Edit name, description, instructions
- Update branding (logo and color)
- **Note**: URL slug cannot be changed

**Form Fields Tab**
- Add, remove, or reorder fields
- Modify field properties
- Change field types (with limitations)

### Important: Editing Forms with Submissions

If your event has submissions, special rules apply:

#### Safe Changes
These changes **won't** affect existing data:
- Changing field labels
- Updating placeholders
- Changing required status
- Reordering fields
- Adding new fields

#### Protected Changes
Changing a field **type** when submissions exist:

**What happens:**
1. System warns you with yellow highlight
2. Old field is preserved (becomes inactive)
3. New field is created with `_v2` suffix
4. Existing submissions keep their data
5. New submissions use the new field

**Example:**
- Original: `dietary_preferences` (text)
- Changed to: dropdown
- Result:
  - Old data in `dietary_preferences`
  - New data in `dietary_preferences_v2`

**Why this matters:**
- Protects existing submission data
- Allows historical analysis
- Prevents data loss
- Maintains data integrity

#### Data Preservation

The platform automatically:
- Backs up data before changes
- Maintains field history
- Links original and versioned fields
- Allows CSV export of all versions

---

## Exporting Data

### CSV Export

Export all submissions as a CSV file:

1. Open your event
2. Go to **Submissions** tab
3. Click **"Export CSV"**
4. File downloads automatically

### CSV File Contents

The exported file includes:
- All submission data
- Timestamps
- All field values
- Headers for easy import

### Using Exported Data

**Compatible with:**
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Database imports
- CRM systems
- Email marketing tools

**Common uses:**
- Backup your data
- Import to CRM
- Email attendees
- Generate name badges
- Create reports
- Share with team members

### Best Practices

- Export regularly as backups
- Store exports securely
- Don't share files with sensitive data
- Delete old exports you don't need

---

## Tips & Best Practices

### Form Design

1. **Keep it short** - Only ask for essential information
2. **Clear labels** - Use plain language, avoid jargon
3. **Smart defaults** - Pre-fill or suggest common answers
4. **Mobile-first** - Test on phones before launching
5. **One column** - Vertical layouts work best on all devices

### Instructions

1. **Be concise** - 2-3 short paragraphs maximum
2. **Answer questions** - What, when, why, what's next
3. **Add contact info** - Help people reach you
4. **Set expectations** - Timeline for confirmation

### Branding

1. **Use your logo** - Increases trust and recognition
2. **Consistent colors** - Match your brand guidelines
3. **Test readability** - Ensure text is legible
4. **Professional images** - Use high-quality logos

### Analytics

1. **Check regularly** - Monitor conversion rates weekly
2. **Test changes** - A/B test different form versions
3. **Reduce friction** - Remove unnecessary fields if conversion is low
4. **Track sources** - Know which marketing channels work

### Data Management

1. **Export weekly** - Regular backups prevent data loss
2. **Clean data** - Remove test submissions
3. **Secure storage** - Protect exported CSV files
4. **GDPR compliance** - Respect privacy laws

---

## Common Questions

### Can I change the URL slug after creating an event?

No, URL slugs are permanent to maintain link integrity. If you need a different URL:
1. Create a new event with the desired slug
2. Copy all settings from the old event
3. Redirect the old URL if possible

### What happens to data when I edit a field type?

The system preserves all existing data and creates a versioned field. Old submissions keep their data, new submissions use the new field type.

### Can I delete an event?

Yes, from the event detail page, use the delete option. **Warning:** This permanently deletes all submissions and cannot be undone.

### Is there a limit on submissions?

No hard limit, but Cloud Run services have quotas. Contact your GCP admin if you expect more than 10,000 submissions per event.

### How do I download all data at once?

Use the CSV export feature on each event. For multiple events, export each separately.

### Can multiple people manage events?

This version uses authentication based on GCP. All users with access to the frontend URL can manage all events.

### Is my data secure?

Yes:
- HTTPS encryption in transit
- Cloud SQL encrypted at rest
- GCP security infrastructure
- Regular security updates

---

## Troubleshooting

### Form not loading

1. Check the URL is correct
2. Verify the event is active
3. Try a different browser
4. Clear browser cache

### QR code not working

1. Ensure you clicked "Generate QR"
2. Download the actual image file
3. Test the QR code with a scanner app
4. Check the URL in the QR code is correct

### Analytics not tracking

1. Refresh the page
2. Wait a few minutes for data to sync
3. Check if you're testing from the same browser (may deduplicate views)

### CSV export issues

1. Disable popup blockers
2. Check download folder permissions
3. Try a different browser
4. Ensure you have submissions to export

---

## Support

### Need Help?

For technical issues or questions:
- Check this user guide first
- Review the deployment documentation
- Contact your GCP administrator
- File an issue on the GitHub repository

### Feature Requests

Have ideas for improvements? We welcome feedback:
- Document your use case
- Explain the problem it solves
- Share on the project repository

---

## Quick Reference

### Event Creation Checklist

- [ ] Choose descriptive event name
- [ ] Create URL-friendly slug
- [ ] Add event description
- [ ] Write form instructions
- [ ] Upload or link logo
- [ ] Select brand color
- [ ] Design form fields
- [ ] Set required fields
- [ ] Test the form
- [ ] Generate QR code
- [ ] Share with attendees

### Regular Maintenance

Weekly:
- [ ] Check analytics
- [ ] Review new submissions
- [ ] Export data backup
- [ ] Monitor conversion rate

Monthly:
- [ ] Review form effectiveness
- [ ] Update instructions if needed
- [ ] Archive completed events
- [ ] Clean up test submissions

---

*Last updated: October 2025*
*Platform version: 1.0*
*Questions? Check DEPLOYMENT.md for technical details*
