const db = require('../config/database');

const createApplication = async (jobId, userId) => {
    try {
        const query = `
            INSERT INTO job_applications (job_id, user_id, status, created_at)
            VALUES ($1, $2, 'pending', NOW())
            RETURNING *
        `;
        const result = await db.query(query, [jobId, userId]);
        return result.rows[0];
    } catch (error) {
        console.error('Ошибка при создании отклика:', error);
        throw error;
    }
};

const getApplicationByJobAndUser = async (jobId, userId) => {
    try {
        const query = `
            SELECT * FROM job_applications
            WHERE job_id = $1 AND user_id = $2
        `;
        const result = await db.query(query, [jobId, userId]);
        return result.rows[0];
    } catch (error) {
        console.error('Ошибка при получении отклика:', error);
        throw error;
    }
};

module.exports = {
    createApplication,
    getApplicationByJobAndUser
}; 