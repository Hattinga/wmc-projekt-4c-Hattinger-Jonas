import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';
import foldersRouter from './routes/folders.js';
import tagsRouter from './routes/tags.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);
app.use('/api/folders', foldersRouter);
app.use('/api/tags', tagsRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404 für unbekannte API-Routen
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

// Zentraler Error-Handler: verhindert Stack-Trace-Leaks im Response
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const server = createServer(app);
server.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
