const pool = require('../config/db');

const getAnswersByQuestionId = async (questionId) => {
    const [rows] = await pool.query('SELECT * FROM test_answers WHERE question_id = ?', [questionId]);
    return rows;
};

const createAnswer = async (answer) => {
    const { question_id, text, is_correct } = answer;
    const [result] = await pool.query(
        'INSERT INTO test_answers (question_id, text, is_correct) VALUES (?, ?, ?)',
        [question_id, text, is_correct]
    );
    return { id: result.insertId, ...answer };
};

module.exports = {
    getAnswersByQuestionId,
    createAnswer,
};