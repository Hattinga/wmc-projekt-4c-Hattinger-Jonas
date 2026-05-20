-- Testdaten für Entwicklung
-- NUR für lokale Entwicklung – NICHT in Produktion ausführen!
-- Passwort für alle Test-User: "password123" (bcrypt-Hash)

INSERT OR IGNORE INTO users (username, email, password_hash) VALUES
  ('testuser', 'test@example.com', '$2b$10$placeholder_hash_replace_with_real_bcrypt');

-- Beispiel-Ordner
INSERT OR IGNORE INTO folders (name, user_id) VALUES
  ('Schule', 1),
  ('Privat', 1);

-- Beispiel-Notizen
INSERT OR IGNORE INTO notes (title, content, user_id, folder_id) VALUES
  ('Willkommen', '# Willkommen bei Zettlwirtschaft\n\nDies ist deine erste Notiz. Verlinke andere Notizen mit [[Notiz-Titel]].', 1, 1),
  ('Zweite Notiz', '# Zweite Notiz\n\nDiese Notiz wird von [[Willkommen]] verlinkt.', 1, 1);

-- Beispiel-Tags
INSERT OR IGNORE INTO tags (name, user_id) VALUES
  ('wichtig', 1),
  ('todo', 1);

INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (1, 1);
