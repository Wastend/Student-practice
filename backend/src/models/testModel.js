const pool = require('../config/db');

const getAllTests = async () => {
    const [rows] = await pool.query('SELECT * FROM tests');
    return rows;
};

const getTestById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM tests WHERE id = ?', [id]);
    return rows[0];
};

const createTest = async (test) => {
    const { job_id, title, description } = test;
    const [result] = await pool.query(
        'INSERT INTO tests (job_id, title, description) VALUES (?, ?, ?)',
        [job_id, title, description]
    );
    return { id: result.insertId, ...test };
};

const saveTestResult = async (result) => {
    const { test_id, student_id, score } = result;
    const [rows] = await pool.query(
        'INSERT INTO test_results (test_id, student_id, score) VALUES (?, ?, ?)',
        [test_id, student_id, score]
    );
    return rows;
};

module.exports = {
    getAllTests,
    getTestById,
    createTest,
    saveTestResult,
};