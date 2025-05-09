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

const updateAnswer = async (id, answer) => {
    const { text, is_correct } = answer;
    const [result] = await pool.query(
        'UPDATE test_answers SET text = ?, is_correct = ? WHERE id = ?',
        [text, is_correct, id]
    );
    return result;
};
 
const deleteAnswer = async (id) => {
    const [result] = await pool.query('DELETE FROM test_answers WHERE id = ?', [id]);
    return result;
};

module.exports = {
    getAnswersByQuestionId,
    createAnswer,
    updateAnswer,
    deleteAnswer,
};