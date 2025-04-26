const pool = require('../config/db');

const getAllApplications = async () => {
    const [rows] = await pool.query('SELECT * FROM applications');
    return rows;
};

const getApplicationById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
    return rows[0];
};

const createApplication = async (application) => {
    const { job_id, student_id, status } = application;
    const [result] = await pool.query(
        'INSERT INTO applications (job_id, student_id, status) VALUES (?, ?, ?)',
        [job_id, student_id, status]
    );
    return { id: result.insertId, ...application };
};

module.exports = {
    getAllApplications,
    getApplicationById,
    createApplication,
};