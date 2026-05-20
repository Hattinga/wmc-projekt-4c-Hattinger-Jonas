// TODO: Socket.io Event-Handler.
// Wird beim Server-Start mit der io-Instanz initialisiert.
// Events:
//   connection    – JWT aus handshake.auth verifizieren; bei Fehler disconnect
//   disconnect    – Logging
// Exportiert emitNoteUpdated(io, userId, note) und emitNoteDeleted(io, userId, noteId)
// für Aufruf aus den REST-Routen nach erfolgreichem Save/Delete.
