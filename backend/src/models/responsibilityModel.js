const pool = require('../config/db');

const getResponsibilitiesByJobId = async (jobId) => {
    const [rows] = await pool.query(
        'SELECT * FROM job_responsibilities WHERE job_id = ? ORDER BY order_index',
        [jobId]
    );
    return rows;
};

const createResponsibilities = async (jobId, responsibilities) => {
    const values = responsibilities.map((item, index) => [jobId, item.text, index]);
    const [result] = await pool.query(
        'INSERT INTO job_responsibilities (job_id, text, order_index) VALUES ?',
        [values]
    );
    return result;
};

const updateResponsibilities = async (jobId, responsibilities) => {
    // Сначала удаляем старые обязанности
    await pool.query('DELETE FROM job_responsibilities WHERE job_id = ?', [jobId]);
    
    // Затем добавляем новые
    if (responsibilities.length > 0) {
        return await createResponsibilities(jobId, responsibilities);
    }
    return null;
};

module.exports = {
    getResponsibilitiesByJobId,
    createResponsibilities,
    updateResponsibilities
}; 