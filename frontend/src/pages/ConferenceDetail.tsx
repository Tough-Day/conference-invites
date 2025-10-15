import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Edit, Trash2, Copy, Check, Eye, Scan, TrendingUp } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api';
import { Conference, Submission } from '../types';

interface AnalyticsSummary {
  pageViews: number;
  qrScans: number;
  submissions: number;
  conversionRate: string;
}

export default function ConferenceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [conference, setConference] = useState<Conference | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [confData, subsData, qrData, analyticsData] = await Promise.all([
        api.getConferenceById(id!),
        api.getSubmissions(id!, 50),
        api.getQRCode(id!),
        api.getAnalytics(id!).catch(() => null),
      ]);

      setConference(confData);
      setSubmissions(subsData.submissions);
      setQrCode(qrData.url);
      if (analyticsData?.summary) {
        setAnalytics(analyticsData.summary);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${conference?.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteConference(id!);
      navigate('/');
    } catch (error) {
      console.error('Error deleting conference:', error);
      alert('Failed to delete event');
    }
  };

  const handleExportCSV = async () => {
    await api.exportCSV(id!);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.querySelector('#qr-code-svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${conference?.slug}-qrcode.svg`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const toggleActive = async () => {
    try {
      await api.updateConference(id!, {
        isActive: !conference!.isActive
      });
      setConference({ ...conference!, isActive: !conference!.isActive });
    } catch (error) {
      console.error('Error updating conference status:', error);
      alert('Failed to update event status');
    }
  };

  const refreshAnalytics = async () => {
    try {
      const analyticsData = await api.getAnalytics(id!);
      if (analyticsData?.summary) {
        setAnalytics(analyticsData.summary);
      }
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    }
  };

  if (loading || !conference) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const formUrl = `${window.location.origin}/form/${conference.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Events
          </button>
          <div className="flex items-center gap-2">
            <a
              href={`/form/${conference.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-white bg-teal-600 border border-teal-600 rounded-lg hover:bg-teal-700 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Preview Form
            </a>
            <button
              onClick={() => navigate(`/conferences/${id}/edit`)}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Title and Status */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{conference.name}</h1>
          {conference.description && (
            <p className="text-gray-600 text-sm mb-2">{conference.description}</p>
          )}
          <div className="flex items-center gap-4">
            {/* Active/Inactive Toggle */}
            <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={conference.isActive !== false}
                    onChange={toggleActive}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    conference.isActive !== false ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      conference.isActive !== false ? 'transform translate-x-4' : ''
                    }`} />
                  </div>
                </div>
                <span className={`text-xs font-semibold ${
                  conference.isActive !== false ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {conference.isActive !== false ? 'Active' : 'Closed'}
                </span>
              </label>
            </div>
            <span className="text-sm text-gray-600">
              {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Column - Submissions (spans 3 columns) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Analytics Stats */}
            {analytics && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-sm font-semibold text-gray-700">Analytics</h2>
                  <button
                    onClick={refreshAnalytics}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <TrendingUp size={12} />
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">Page Views</p>
                        <p className="text-xl font-bold text-gray-900">{analytics.pageViews}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center gap-2">
                      <Scan size={16} className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">QR Scans</p>
                        <p className="text-xl font-bold text-gray-900">{analytics.qrScans}</p>
                      </div>
                    </div>
                  </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Submissions</p>
                      <p className="text-xl font-bold text-gray-900">{analytics.submissions}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-600">Conversion</p>
                      <p className="text-xl font-bold text-gray-900">{analytics.conversionRate}%</p>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            )}

            {/* Submissions */}
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Submissions</h2>
                {submissions.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                )}
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No submissions yet</p>
                  <p className="text-gray-400 text-sm mt-1">Share your form URL to start collecting responses</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">
                          Submitted At
                        </th>
                        {conference.formFields.map((field) => (
                          <th
                            key={field.fieldName}
                            className={`px-3 py-2 text-left text-xs font-semibold ${
                              field.isActive === false
                                ? 'text-gray-400 bg-gray-100'
                                : 'text-gray-900'
                            }`}
                          >
                            {field.label}
                            {field.isActive === false && (
                              <span className="ml-1 text-[10px] text-gray-500">(archived)</span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {submissions.map((submission) => (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-gray-900 whitespace-nowrap">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </td>
                          {conference.formFields.map((field) => (
                            <td
                              key={field.fieldName}
                              className={`px-3 py-2 text-xs ${
                                field.isActive === false
                                  ? 'text-gray-400 bg-gray-50'
                                  : 'text-gray-900'
                              }`}
                            >
                              {submission.formData[field.fieldName] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* QR Code - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">QR Code</h2>

              <div className="flex flex-col items-center">
                <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                  <div id="qr-code-svg">
                    <QRCodeSVG
                      value={qrCode}
                      size={160}
                      level="H"
                      imageSettings={{
                        src: '/assets/toughday-logo.png',
                        height: 32,
                        width: 32,
                        excavate: true,
                      }}
                    />
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Form URL</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={formUrl}
                        readOnly
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded bg-gray-50 font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(formUrl)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Copy URL"
                      >
                        {copied ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <Copy size={14} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {conference.shortUrl && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Short URL</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={conference.shortUrl}
                          readOnly
                          className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded bg-gray-50"
                        />
                        <button
                          onClick={() => copyToClipboard(conference.shortUrl!)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Copy Short URL"
                        >
                          {copied ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={downloadQR}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download size={16} />
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
