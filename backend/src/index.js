import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRouter from './routes/auth.js';
import createNotesRouter from './routes/notes.js';
import foldersRouter from './routes/folders.js';
import tagsRouter from './routes/tags.js';
import graphRouter from './routes/graph.js';
import { initWebSocket } from './websocket/handler.js';

const app = express();
const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: frontendUrl }));
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: frontendUrl },
});
initWebSocket(io);

app.use('/api/auth', authRouter);
app.use('/api/notes', createNotesRouter(io));
app.use('/api/folders', foldersRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/graph', graphRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404 für unbekannte API-Routen
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

// Zentraler Error-Handler: verhindert Stack-Trace-Leaks im Response
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

server.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
