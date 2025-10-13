// Use backend URL directly for authenticated requests (session cookies are set on backend domain)
const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : 'https://conference-invites-backend-615509061125.us-central1.run.app/api';

export const api = {
  // Conferences
  getConferences: async () => {
    const res = await fetch(`${API_BASE}/conferences`, {
      credentials: 'include',
    });
    return res.json();
  },

  getConference: async (slug: string) => {
    const res = await fetch(`${API_BASE}/conferences/${slug}`, {
      credentials: 'include',
    });
    return res.json();
  },

  createConference: async (data: any) => {
    const res = await fetch(`${API_BASE}/conferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return res.json();
  },

  updateConference: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/conferences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return res.json();
  },

  deleteConference: async (id: string) => {
    const res = await fetch(`${API_BASE}/conferences/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },

  getQRCode: async (id: string) => {
    const res = await fetch(`${API_BASE}/conferences/${id}/qrcode`, {
      credentials: 'include',
    });
    return res.json();
  },

  // Submissions
  getSubmissions: async (conferenceId: string, limit?: number, offset?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const res = await fetch(`${API_BASE}/submissions/conference/${conferenceId}?${params}`, {
      credentials: 'include',
    });
    return res.json();
  },

  createSubmission: async (data: any) => {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  exportCSV: async (conferenceId: string) => {
    const res = await fetch(`${API_BASE}/submissions/conference/${conferenceId}/export/csv`, {
      credentials: 'include',
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${conferenceId}.csv`;
    a.click();
  },

  exportHubSpot: async (conferenceId: string) => {
    const res = await fetch(`${API_BASE}/submissions/conference/${conferenceId}/export/hubspot`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.json();
  },

  // Analytics
  trackEvent: async (conferenceId: string, eventType: string, metadata?: any) => {
    const res = await fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conferenceId, eventType, metadata }),
    });
    return res.json();
  },

  getAnalytics: async (conferenceId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const res = await fetch(`${API_BASE}/analytics/conference/${conferenceId}?${params}`, {
      credentials: 'include',
    });
    return res.json();
  },

  getOverview: async () => {
    const res = await fetch(`${API_BASE}/analytics/overview`, {
      credentials: 'include',
    });
    return res.json();
  },
};
