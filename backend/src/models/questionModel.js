const pool = require('../config/db');

const getQuestionsByTestId = async (testId) => {
    const [rows] = await pool.query('SELECT * FROM test_questions WHERE test_id = ?', [testId]);
    return rows;
};

const createQuestion = async (question) => {
    const { test_id, text } = question;
    const [result] = await pool.query(
        'INSERT INTO test_questions (test_id, text) VALUES (?, ?)',
        [test_id, text]
    );
    return { id: result.insertId, ...question };
};

module.exports = {
    getQuestionsByTestId,
    createQuestion,
};