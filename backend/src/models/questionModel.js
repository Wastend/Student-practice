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

const updateQuestion = async (id, question) => {
    const { text } = question;
    const [result] = await pool.query(
        'UPDATE test_questions SET text = ? WHERE id = ?',
        [text, id]
    );
    return result;
};

const deleteQuestion = async (id) => {
    const [result] = await pool.query('DELETE FROM test_questions WHERE id = ?', [id]);
    return result;
};

module.exports = {
    getQuestionsByTestId,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};