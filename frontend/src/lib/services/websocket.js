// Socket.io Client-Logik
// Verbindet sich mit PUBLIC_WS_URL, sendet JWT zur Authentifizierung.

import { appState } from '$lib/stores/appState.svelte.js';

const WS_URL = import.meta.env.PUBLIC_WS_URL || 'http://localhost:3000';

let socket = null;

export function connectWs() {
  if (socket?.connected) return;
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('zw-token') : null;
  if (!token) return;

  // Dynamischer Import damit Socket.io nur im Browser geladen wird
  import('socket.io-client').then(({ io }) => {
    socket = io(WS_URL, {
      auth: { token },
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      appState.wsConnected = true;
    });

    socket.on('disconnect', () => {
      appState.wsConnected = false;
    });

    socket.on('note:created', (note) => {
      // Nur ergänzen, wenn die Note nicht schon lokal existiert (eigener Tab hat sie bereits)
      if (!appState.notes.some(n => n.id === note.id)) {
        appState.notes = [note, ...appState.notes];
      }
    });

    socket.on('note:updated', (note) => {
      const idx = appState.notes.findIndex(n => n.id === note.id);
      if (idx >= 0) {
        appState.notes[idx] = { ...appState.notes[idx], ...note };
      }
    });

    socket.on('note:deleted', (noteId) => {
      appState.notes = appState.notes.filter(n => n.id !== noteId);
    });
  }).catch(() => {
    console.warn('[WS] Socket.io nicht verfügbar');
  });
}

export function disconnectWs() {
  socket?.disconnect();
  socket = null;
  appState.wsConnected = false;
}

export function getSocket() {
  return socket;
}
