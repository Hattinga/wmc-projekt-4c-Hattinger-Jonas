// REST-API Fetch-Wrapper
// Liest JWT aus localStorage, setzt Authorization-Header automatisch.

import { goto } from '$app/navigation';

const BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

function getToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('zw-token');
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Netzwerkfehler – keine Verbindung zum Server.');
  }

  // Abgelaufenes/ungültiges Token → ausloggen und weiterleiten
  if (res.status === 401) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('zw-token');
      localStorage.removeItem('zw-user');
    }
    goto('/auth');
    throw new Error('Sitzung abgelaufen. Bitte erneut anmelden.');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || `HTTP ${res.status}`);
  }

  // 204 No Content (z.B. DELETE)
  if (res.status === 204) return null;
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
export const addTagToNote = (noteId, tagId) => request('POST', `/tags/notes/${noteId}`, { tagId });
export const removeTagFromNote = (noteId, tagId) => request('DELETE', `/tags/notes/${noteId}/${tagId}`);

// Graph
export const getGraph = () => request('GET', '/graph');
