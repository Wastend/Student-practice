const answerModel = require('../models/answerModel');

const getAnswersByQuestionId = async (req, res) => {
    try {
        const answers = await answerModel.getAnswersByQuestionId(req.params.questionId);
        res.json(answers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const createAnswer = async (req, res) => {
    try {
        const newAnswer = await answerModel.createAnswer(req.body);
        res.status(201).json(newAnswer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    getAnswersByQuestionId,
    createAnswer,
};