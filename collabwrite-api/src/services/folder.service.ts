import { pool } from '../config/db.config.js';

export const folderService = {
    async getFolders(userId: string) {
        const result = await pool.query(`SELECT folders.id, folders.name, folders.created_at, folders.updated_at, users.full_name FROM folders INNER JOIN users ON folders.owner_id = users.id WHERE folders.owner_id = $1`, [userId]);
        return result.rows;
    },

    async createFolder(userId: string, name: string) {
        const resultId = await pool.query('SELECT gen_random_uuid() as id');
        const id = resultId.rows[0].id;

        const result = await pool.query( 
        `INSERT INTO folders (id, name, owner_id, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *`,
        [id, name, userId]
        );

        return result.rows[0];
    }
}