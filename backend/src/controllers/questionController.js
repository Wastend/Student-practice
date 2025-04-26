// filepath: d:\sites\Student-practice\backend\src\controllers\questionController.js
const questionModel = require('../models/questionModel');

const getQuestionsByTestId = async (req, res) => {
    try {
        const questions = await questionModel.getQuestionsByTestId(req.params.testId);
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const createQuestion = async (req, res) => {
    try {
        const newQuestion = await questionModel.createQuestion(req.body);
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    getQuestionsByTestId,
    createQuestion,
};