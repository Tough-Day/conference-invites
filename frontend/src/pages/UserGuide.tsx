import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Eye, QrCode, Download, Edit } from 'lucide-react';

export default function UserGuide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Guide</h1>
          <p className="text-gray-600">Learn how to create and manage event registration forms</p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#getting-started" className="text-teal-600 hover:text-teal-700 hover:underline">1. Getting Started</a>
            <a href="#creating-event" className="text-teal-600 hover:text-teal-700 hover:underline">2. Creating Your First Event</a>
            <a href="#form-fields" className="text-teal-600 hover:text-teal-700 hover:underline">3. Managing Form Fields</a>
            <a href="#branding" className="text-teal-600 hover:text-teal-700 hover:underline">4. Customizing Event Branding</a>
            <a href="#instructions" className="text-teal-600 hover:text-teal-700 hover:underline">5. Adding Form Instructions</a>
            <a href="#sharing" className="text-teal-600 hover:text-teal-700 hover:underline">6. Sharing Your Event Form</a>
            <a href="#submissions" className="text-teal-600 hover:text-teal-700 hover:underline">7. Viewing Submissions</a>
            <a href="#analytics" className="text-teal-600 hover:text-teal-700 hover:underline">8. Tracking Analytics</a>
            <a href="#editing" className="text-teal-600 hover:text-teal-700 hover:underline">9. Editing Events</a>
            <a href="#exporting" className="text-teal-600 hover:text-teal-700 hover:underline">10. Exporting Data</a>
          </div>
        </div>

        {/* Getting Started */}
        <div id="getting-started" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
            Getting Started
          </h2>
          <p className="text-gray-700 mb-3">
            The dashboard displays all your events with their submission counts and status.
            Click the <strong>"New Event"</strong> button to create your first event registration form.
          </p>
        </div>

        {/* Creating Your First Event */}
        <div id="creating-event" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
            Creating Your First Event
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1: Basic Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Event Name</strong> (required) - Example: "Tech Conference 2025"</li>
                <li><strong>URL Slug</strong> (required) - Must be unique and URL-friendly. Cannot be changed after creation.</li>
                <li><strong>Description</strong> (optional) - Brief description of your event</li>
                <li><strong>Form Instructions</strong> (optional) - Instructions displayed at the top of the registration form</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2: Branding (Optional)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Logo URL</strong> - Enter a direct URL to your event logo</li>
                <li><strong>Primary Color</strong> - Choose your brand color using the color picker</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3: Form Fields</h3>
              <p className="text-gray-700 mb-2">Every new event starts with three default fields: Name, Email, and Phone.</p>
              <p className="text-gray-700 mb-2"><strong>Field Types:</strong></p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Short text</strong> - Single line text input</li>
                <li><strong>Paragraph</strong> - Multi-line text area</li>
                <li><strong>Multiple choice</strong> - Radio buttons (select one)</li>
                <li><strong>Dropdown</strong> - Select menu (select one)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Managing Form Fields */}
        <div id="form-fields" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600 flex items-center gap-2">
            <Edit size={24} />
            Managing Form Fields
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reordering Fields</h3>
              <p className="text-gray-700">Click and hold the grip icon (⋮⋮) on the left side of any field, then drag it to the desired position.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adding Fields Between Existing Ones</h3>
              <p className="text-gray-700">Click "Insert below" on the field above where you want the new field.</p>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <p className="text-sm text-teal-900">
                <strong>Tip:</strong> Keep forms short - only ask for essential information. Use clear, concise labels and mark only truly required fields.
              </p>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div id="branding" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
            Customizing Event Branding
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adding a Logo</h3>
              <p className="text-gray-700 mb-2">Host your logo image on a public URL and enter it in the Logo URL field.</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700"><strong>Logo Requirements:</strong></p>
                <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                  <li>Must be a public URL</li>
                  <li>Recommended formats: PNG, JPG, SVG</li>
                  <li>Recommended size: 200-400px wide</li>
                  <li>Keep file size under 500KB</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choosing a Color</h3>
              <p className="text-gray-700">Use the color picker or enter a 6-digit hex code (e.g., #FF5733). Ensure good contrast with white text.</p>
            </div>
          </div>
        </div>

        {/* Form Instructions */}
        <div id="instructions" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
            Adding Form Instructions
          </h2>

          <p className="text-gray-700 mb-3">Form instructions appear at the top of the registration form, before any fields.</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-3">
            <p className="text-sm font-semibold text-gray-900 mb-2">Best Practices:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-green-700">Do:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Keep it concise (2-3 paragraphs max)</li>
                  <li>Use clear, friendly language</li>
                  <li>Include only essential information</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-red-700">Don't:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Write long blocks of text</li>
                  <li>Use technical jargon</li>
                  <li>Include sensitive information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sharing */}
        <div id="sharing" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600 flex items-center gap-2">
            <QrCode size={24} />
            Sharing Your Event Form
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Direct URL</h3>
              <p className="text-gray-700 mb-2">Every event has a permanent URL you can share via email, social media, website, or SMS.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. QR Code</h3>
              <p className="text-gray-700 mb-2">Generate a QR code for physical marketing:</p>
              <ol className="list-decimal list-inside text-gray-700 space-y-1 ml-4">
                <li>Go to your event detail page</li>
                <li>Click "Download QR Code"</li>
                <li>Print on flyers, posters, name badges, or presentation slides</li>
              </ol>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <p className="text-sm text-teal-900">
                <strong>Tracking:</strong> All form access methods are tracked in Analytics - direct visits, QR scans, and submissions.
              </p>
            </div>
          </div>
        </div>

        {/* Submissions */}
        <div id="submissions" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600 flex items-center gap-2">
            <CheckCircle size={24} />
            Viewing Submissions
          </h2>

          <p className="text-gray-700 mb-3">Click on any event from the Dashboard to view all submissions in a table format.</p>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-2">The submission table displays:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
              <li>Timestamp - When the form was submitted</li>
              <li>Field Data - All form fields as columns</li>
              <li>All custom fields you defined</li>
            </ul>
          </div>
        </div>

        {/* Analytics */}
        <div id="analytics" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600 flex items-center gap-2">
            <Eye size={24} />
            Tracking Analytics
          </h2>

          <p className="text-gray-700 mb-4">View key metrics at a glance from your event detail page.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-semibold text-blue-900 mb-1">Page Views</p>
              <p className="text-sm text-blue-800">Total number of times the form was loaded</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="font-semibold text-purple-900 mb-1">QR Code Scans</p>
              <p className="text-sm text-purple-800">Number of times the QR code was scanned</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="font-semibold text-green-900 mb-1">Form Submissions</p>
              <p className="text-sm text-green-800">Total completed and submitted forms</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="font-semibold text-orange-900 mb-1">Conversion Rate</p>
              <p className="text-sm text-orange-800">Calculated as: (Submissions / Page Views) × 100</p>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-2">Using Analytics:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 ml-4 space-y-1">
              <li><strong>Low page views?</strong> Increase marketing efforts and share form in more channels</li>
              <li><strong>Low conversion rate?</strong> Simplify the form, make instructions clearer, or test on mobile</li>
              <li><strong>High QR scan rate?</strong> Your physical marketing is working well</li>
            </ul>
          </div>
        </div>

        {/* Editing */}
        <div id="editing" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
            Editing Events
          </h2>

          <p className="text-gray-700 mb-3">From the Dashboard, click an event and then click the "Edit" button.</p>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-3">
            <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Important: Editing Forms with Submissions</p>
            <p className="text-sm text-yellow-800 mb-2">If your event has submissions, changing a field <strong>type</strong> will:</p>
            <ul className="list-disc list-inside text-sm text-yellow-800 ml-4">
              <li>Preserve the old field (becomes inactive)</li>
              <li>Create a new field with _v2 suffix</li>
              <li>Keep all existing submission data intact</li>
              <li>New submissions use the new field</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-2">Safe Changes (won't affect existing data):</p>
            <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
              <li>Changing field labels</li>
              <li>Updating placeholders</li>
              <li>Changing required status</li>
              <li>Reordering fields</li>
              <li>Adding new fields</li>
            </ul>
          </div>
        </div>

        {/* Exporting */}
        <div id="exporting" className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600 flex items-center gap-2">
            <Download size={24} />
            Exporting Data
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CSV Export</h3>
              <p className="text-gray-700 mb-2">Export all submissions as a CSV file:</p>
              <ol className="list-decimal list-inside text-gray-700 space-y-1 ml-4">
                <li>Open your event</li>
                <li>Click "Export CSV"</li>
                <li>File downloads automatically</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">The exported file includes:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                <li>All submission data</li>
                <li>Timestamps</li>
                <li>All field values</li>
                <li>Headers for easy import</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-900 mb-2">Compatible with:</p>
              <p className="text-sm text-gray-700">Microsoft Excel, Google Sheets, LibreOffice Calc, CRM systems, and email marketing tools.</p>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <p className="text-sm text-teal-900">
                <strong>Best Practice:</strong> Export regularly as backups, store exports securely, and don't share files with sensitive data.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-teal-600">
            Quick Reference
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Creation Checklist</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Choose descriptive event name</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Create URL-friendly slug</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Add event description</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Write form instructions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Upload or link logo</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Select brand color</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Design form fields</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Test the form</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Generate QR code</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-400">☐</span>
                  <span>Share with attendees</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Regular Maintenance</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-sm text-gray-800 mb-1">Weekly:</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">☐</span>
                      <span>Check analytics</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">☐</span>
                      <span>Review new submissions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">☐</span>
                      <span>Export data backup</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800 mb-1">Monthly:</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">☐</span>
                      <span>Review form effectiveness</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">☐</span>
                      <span>Update instructions if needed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400">☐</span>
                      <span>Archive completed events</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Last updated: October 2025 • Platform version: 1.0</p>
        </div>
      </div>
    </div>
  );
}
