import { pool } from '../config/db.config.js';

export interface DocumentRow {
  id: string;
  owner_id: string;
  folder_id: string | null;
  name: string;
  file_type: 'txt' | 'png' | 'pdf';
  description: string | null;
  content: string;
  file_path: string | null;
  size: number | null;
  created_at: string;
  updated_at: string;
}

export const documentService = {
  async listDocuments(ownerId: string) {
    const result = await pool.query<DocumentRow>(
      `SELECT * FROM documents WHERE owner_id = $1 AND is_deleted = FALSE ORDER BY updated_at DESC`,
      [ownerId]
    );
    return result.rows;
  },

  async getDocumentById(id: string, ownerId: string) {
    const result = await pool.query<DocumentRow>(
      `SELECT * FROM documents WHERE id = $1 AND owner_id = $2 AND is_deleted = FALSE`,
      [id, ownerId]
    );
    return result.rows[0] || null;
  },

  async getDocumentByNameAndFolder(ownerId: string, name: string, fileType: 'txt' | 'png' | 'pdf', folderId: string | null) {
    const result = await pool.query<DocumentRow>(
      `SELECT * FROM documents 
       WHERE owner_id = $1 AND name = $2 AND file_type = $3 AND folder_id IS NOT DISTINCT FROM $4 AND is_deleted = FALSE`,
      [ownerId, name, fileType, folderId]
    );
    return result.rows[0] || null;
  },

  async createDocument(ownerId: string, data: {
    name: string;
    fileType: 'txt' | 'png' | 'pdf';
    folderId?: string | null;
    description?: string | null;
    content: string;
    filePath?: string | null;
    size?: number | null;
  }) {
    const { name, fileType, folderId = null, description = null, content, filePath = null, size = null } = data;

    // Vérifier si un document avec le même nom, type et dossier existe déjà
    const existing = await this.getDocumentByNameAndFolder(ownerId, name, fileType, folderId);
    
    if (existing) {
      // Si un document existe, le mettre à jour au lieu d'en créer un nouveau
      const updated = await this.updateDocument(existing.id, ownerId, {
        content,
        description,
        filePath,
        size,
      });
      return updated || existing;
    }

    // Sinon, créer un nouveau document
    const newIdResult = await pool.query('SELECT gen_random_uuid() as id');
    const id = newIdResult.rows[0].id as string;

    const result = await pool.query<DocumentRow>(
      `INSERT INTO documents (id, owner_id, folder_id, name, file_type, description, content, file_path, size, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [id, ownerId, folderId, name, fileType, description, content, filePath, size]
    );

    return result.rows[0];
  },

  async updateDocument(id: string, ownerId: string, updates: {
    name?: string;
    folderId?: string | null;
    description?: string | null;
    content?: string | null;
    filePath?: string | null;
    size?: number | null;
  }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name');
      values.push(updates.name);
    }
    if (updates.folderId !== undefined) {
      fields.push('folder_id');
      values.push(updates.folderId);
    }
    if (updates.description !== undefined) {
      fields.push('description');
      values.push(updates.description);
    }
    if (updates.content !== undefined) {
      fields.push('content');
      values.push(updates.content);
    }
    if (updates.filePath !== undefined) {
      fields.push('file_path');
      values.push(updates.filePath);
    }
    if (updates.size !== undefined) {
      fields.push('size');
      values.push(updates.size);
    }

    if (fields.length === 0) {
      const existing = await this.getDocumentById(id, ownerId);
      return existing;
    }

    const setClause = fields.map((f, idx) => `${f} = $${idx + 3}`).join(', ');
    const result = await pool.query<DocumentRow>(
      `UPDATE documents SET ${setClause}, updated_at = NOW() WHERE id = $1 AND owner_id = $2 AND is_deleted = FALSE RETURNING *`,
      [id, ownerId, ...values]
    );
    return result.rows[0] || null;
  },

  async deleteDocument(id: string, ownerId: string) {
    await pool.query(
      `UPDATE documents SET is_deleted = TRUE, updated_at = NOW() WHERE id = $1 AND owner_id = $2`,
      [id, ownerId]
    );
  },
};


