import jwt from 'jsonwebtoken';

export function initWebSocket(io) {
  io.on('connection', (socket) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      socket.disconnect(true);
      return;
    }
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.join(`user:${user.id}`);
    } catch {
      socket.disconnect(true);
    }
  });
}

export function emitNoteCreated(io, userId, note) {
  io.to(`user:${userId}`).emit('note:created', note);
}

export function emitNoteUpdated(io, userId, note) {
  io.to(`user:${userId}`).emit('note:updated', note);
}

export function emitNoteDeleted(io, userId, noteId) {
  io.to(`user:${userId}`).emit('note:deleted', noteId);
}
