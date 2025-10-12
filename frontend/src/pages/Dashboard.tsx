import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api } from '../services/api';
import { Conference } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConferences();
  }, []);

  const loadConferences = async () => {
    try {
      const data = await api.getConferences();
      setConferences(data);
    } catch (error) {
      console.error('Error loading conferences:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start gap-6 mb-6">
          <img src="/assets/toughday-logo.png" alt="Tuffy Day Logo" className="h-16 object-contain flex-shrink-0" />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Events Form Manager</h1>
            <p className="text-gray-600 text-sm">Create and manage event registration forms with QR codes and track submissions in real-time</p>
          </div>
          <button
            onClick={() => navigate('/conferences/new')}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 flex items-center gap-2 font-medium shadow transition-all text-sm flex-shrink-0"
          >
            <Plus size={18} />
            New Event
          </button>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {conferences.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg">No events yet. Create your first one!</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Event Name</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Submissions</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {conferences.map((conference) => (
                  <tr
                    key={conference.id}
                    onClick={() => navigate(`/conferences/${conference.id}`)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-gray-900">
                        {conference.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-gray-900">
                        {conference._count?.submissions || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        conference.isActive !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {conference.isActive !== false ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={`/form/${conference.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-teal-600 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Preview
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
