// TODO: Folder-Model – DB-Zugriff für folders-Tabelle.
// Exportiert:
//   Folder.findAll(userId)              → Array (flach, parent_id für Baum-Aufbau im Frontend)
//   Folder.create({ name, userId, parentId }) → neuer Ordner
//   Folder.update(id, userId, fields)   → umbenannt/verschoben
//   Folder.delete(id, userId)           → void (Notizen bleiben, folder_id → NULL)
