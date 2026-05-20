// REST-API Fetch-Wrapper
// Liest JWT aus localStorage, setzt Authorization-Header automatisch.

const BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

function getToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('zw-token');
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export const login = (email, password) => request('POST', '/auth/login', { email, password });
export const register = (username, email, password) => request('POST', '/auth/register', { username, email, password });
export const getMe = () => request('GET', '/auth/me');
export const updateMe = (data) => request('PATCH', '/auth/me', data);

// Notes
export const getNotes = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request('GET', `/notes${q ? '?' + q : ''}`);
};
export const getNote = (id) => request('GET', `/notes/${id}`);
export const createNote = (data) => request('POST', '/notes', data);
export const updateNote = (id, data) => request('PUT', `/notes/${id}`, data);
export const deleteNote = (id) => request('DELETE', `/notes/${id}`);
export const getNoteBacklinks = (id) => request('GET', `/notes/${id}/backlinks`);

// Folders
export const getFolders = () => request('GET', '/folders');
export const createFolder = (data) => request('POST', '/folders', data);
export const updateFolder = (id, data) => request('PUT', `/folders/${id}`, data);
export const deleteFolder = (id) => request('DELETE', `/folders/${id}`);

// Tags
export const getTags = () => request('GET', '/tags');
export const createTag = (data) => request('POST', '/tags', data);
export const deleteTag = (id) => request('DELETE', `/tags/${id}`);

// Graph
export const getGraph = () => request('GET', '/graph');
