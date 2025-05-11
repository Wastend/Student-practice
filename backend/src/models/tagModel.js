const pool = require('../config/db');

const getAllTags = async () => {
    const [rows] = await pool.query('SELECT * FROM tags ORDER BY name');
    return rows;
};

const getTagsByJobId = async (jobId) => {
    const [rows] = await pool.query(
        'SELECT t.* FROM tags t JOIN job_tags jt ON t.id = jt.tag_id WHERE jt.job_id = ?',
        [jobId]
    );
    return rows;
};

const createTag = async (name) => {
    const [result] = await pool.query('INSERT INTO tags (name) VALUES (?)', [name]);
    return { id: result.insertId, name };
};

const updateJobTags = async (jobId, tagIds) => {
    // Удаляем старые связи
    await pool.query('DELETE FROM job_tags WHERE job_id = ?', [jobId]);
    
    // Добавляем новые связи
    if (tagIds && tagIds.length > 0) {
        const values = tagIds.map(tagId => [jobId, tagId]);
        await pool.query('INSERT INTO job_tags (job_id, tag_id) VALUES ?', [values]);
    }
};

module.exports = {
    getAllTags,
    getTagsByJobId,
    createTag,
    updateJobTags
}; 