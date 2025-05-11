const pool = require('../config/db');

const getRequirementsByJobId = async (jobId) => {
    const [rows] = await pool.query(
        'SELECT * FROM job_requirements WHERE job_id = ? ORDER BY order_index',
        [jobId]
    );
    return rows;
};

const createRequirements = async (jobId, requirements) => {
    const values = requirements.map((item, index) => [jobId, item.text, index]);
    const [result] = await pool.query(
        'INSERT INTO job_requirements (job_id, text, order_index) VALUES ?',
        [values]
    );
    return result;
};

const updateRequirements = async (jobId, requirements) => {
    // Сначала удаляем старые требования
    await pool.query('DELETE FROM job_requirements WHERE job_id = ?', [jobId]);
    
    // Затем добавляем новые
    if (requirements.length > 0) {
        return await createRequirements(jobId, requirements);
    }
    return null;
};

module.exports = {
    getRequirementsByJobId,
    createRequirements,
    updateRequirements
}; 