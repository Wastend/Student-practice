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
        "INSERT INTO tests (job_id, title, description) VALUES (?, ?, ?)",
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

const deleteTest = async (id) => {
    const [result] = await pool.query("DELETE FROM tests WHERE id = ?", [id]);
    return result;
};

const updateTest = async (id, test) => {
    const { title, description } = test;
    const [result] = await pool.query(
        "UPDATE tests SET title = ?, description = ? WHERE id = ?",
        [title, description, id]
    );
    return result;
};

module.exports = {
    getAllTests,
    getTestById,
    saveTestResult,
    deleteTest,
    createTest,
    updateTest,
};