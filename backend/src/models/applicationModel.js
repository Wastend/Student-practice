const pool = require('../config/db');

const getAllApplications = async (filters = {}) => {
    let query = `
        SELECT a.*, j.title as job_title 
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE 1=1
    `;
    const params = [];

    if (filters.student_id) {
        query += ' AND a.student_id = ?';
        params.push(filters.student_id);
    }

    const [rows] = await pool.query(query, params);
    return rows;
};

const getCompanyApplications = async (employerId) => {
    const query = `
        SELECT 
            a.*,
            j.title as job_title,
            u.username as student_name,
            u.email as student_email,
            cl.id as cover_letter_id
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.student_id = u.id
        LEFT JOIN cover_letters cl ON u.id = cl.user_id
        WHERE j.employer_id = ?
        ORDER BY a.applied_at DESC
    `;
    const [rows] = await pool.query(query, [employerId]);
    return rows;
};

const getApplicationById = async (id) => {
    const [rows] = await pool.query(`
        SELECT a.*, j.title as job_title 
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.id = ?
    `, [id]);
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

const updateApplicationStatus = async (id, status) => {
    const [result] = await pool.query(
        'UPDATE applications SET status = ? WHERE id = ?',
        [status, id]
    );
    if (result.affectedRows === 0) {
        return null;
    }
    return getApplicationById(id);
};

module.exports = {
    getAllApplications,
    getCompanyApplications,
    getApplicationById,
    createApplication,
    updateApplicationStatus
};