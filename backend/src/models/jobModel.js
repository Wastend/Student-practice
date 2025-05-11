const pool = require('../config/db');

const getAllJobs = async (filters) => {
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
    }

    if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
    }

    if (filters.location) {
        query += ' AND location = ?';
        params.push(filters.location);
    }

    const [rows] = await pool.query(query, params);
    return rows;
};

const getJobById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
    return rows[0];
};

const createJob = async (job) => {
    const { title, description, category, location, remote, salary, employer_id, deadline, status } = job;
    const [result] = await pool.query(
        'INSERT INTO jobs (title, description, category, location, remote, salary, employer_id, deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, category, location, remote, salary, employer_id, deadline, status || 'draft']
    );
    return { id: result.insertId, ...job };
};

const updateJob = async (id, job) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(job)) {
        fields.push(`${key} = ?`);
        values.push(value);
    }

    const query = `UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await pool.query(query, values);
    return result;
};

const deleteJob = async (id) => {
    const [result] = await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
    return result;
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};