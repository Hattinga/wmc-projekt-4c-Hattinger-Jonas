import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || join(__dirname, '../../db/zettlwirtschaft.db');
const schemaPath = join(__dirname, '../../db/schema.sql');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.exec(readFileSync(schemaPath, 'utf8'));

export default db;
