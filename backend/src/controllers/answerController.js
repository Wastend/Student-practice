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
        const { text, isCorrect } = req.body;
        const { questionId } = req.params;

        const newAnswer = await answerModel.createAnswer({
            question_id: questionId,
            text,
            is_correct: isCorrect,
        });

        res.status(201).json(newAnswer);
    } catch (error) {
        console.error("Ошибка при создании ответа:", error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const deleteAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        await answerModel.deleteAnswer(id);
        res.json({ message: 'Ответ успешно удалён' });
    } catch (error) {
        console.error('Ошибка при удалении ответа:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    getAnswersByQuestionId,
    createAnswer,
    deleteAnswer,
};