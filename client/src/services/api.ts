const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  registerStudent: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/student/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  loginStudent: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/student/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  loginAdmin: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Student
  getProfile: async () => {
    const res = await fetch(`${API_URL}/student/profile`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getProgress: async () => {
    const res = await fetch(`${API_URL}/student/progress`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Challenges
  submitChallenge: async (challengeType: string, data: any) => {
    const res = await fetch(`${API_URL}/challenges/${challengeType}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Event
  getEventState: async () => {
    const res = await fetch(`${API_URL}/event/state`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Admin
  getAdminStudents: async () => {
    const res = await fetch(`${API_URL}/admin/students`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  setEventState: async (state: 'start' | 'pause' | 'end') => {
    const res = await fetch(`${API_URL}/admin/event/${state}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  resetEvent: async () => {
    const res = await fetch(`${API_URL}/admin/event/reset`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};
