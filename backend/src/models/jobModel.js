const pool = require('../config/db');

const getAllJobs = async (filters) => {
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

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
    const { title, description, category, location, remote, salary, employer_id, deadline } = job;
    const [result] = await pool.query(
        'INSERT INTO jobs (title, description, category, location, remote, salary, employer_id, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, category, location, remote, salary, employer_id, deadline]
    );
    return { id: result.insertId, ...job };
};

const updateJob = async (id, job) => {
    const { title, description, category, location, remote, salary, deadline, testId } = job;
    const [result] = await pool.query(
        'UPDATE jobs SET title = ?, description = ?, category = ?, location = ?, remote = ?, salary = ?, deadline = ?, test_id = ? WHERE id = ?',
        [title, description, category, location, remote, salary, deadline, testId, id]
    );
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