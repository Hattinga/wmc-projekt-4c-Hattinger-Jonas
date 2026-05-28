import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import authRouter from './routes/auth.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRouter);

// Weitere Routen werden in KW 22/23 eingebunden sobald implementiert
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const server = createServer(app);
server.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
