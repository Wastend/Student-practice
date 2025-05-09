// filepath: d:\sites\Student-practice\backend\src\controllers\questionController.js
const questionModel = require('../models/questionModel');
const answerModel = require('../models/answerModel');

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
        const { text } = req.body;
        const { testId } = req.params;

        const newQuestion = await questionModel.createQuestion({
            test_id: testId,
            text,
        });

        res.status(201).json(newQuestion);
    } catch (error) {
        console.error("Ошибка при создании вопроса:", error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const getQuestionsWithAnswers = async (req, res) => {
    try {
        const questions = await questionModel.getQuestionsByTestId(req.params.testId);

        // Для каждого вопроса получаем ответы
        const questionsWithAnswers = await Promise.all(
            questions.map(async (question) => {
                const answers = await answerModel.getAnswersByQuestionId(question.id);
                return { ...question, answers };
            })
        );

        res.json(questionsWithAnswers);
    } catch (error) {
        console.error("Ошибка при получении вопросов и ответов:", error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const updateQuestionsAndAnswers = async (req, res) => {
    try {
        const { testId } = req.params;
        const { questions } = req.body;

        for (const question of questions) {
            if (question.id) {
                // Обновляем существующий вопрос
                await questionModel.updateQuestion(question.id, { text: question.text });
            } else {
                // Создаём новый вопрос
                const newQuestion = await questionModel.createQuestion({
                    test_id: testId,
                    text: question.text,
                });
                question.id = newQuestion.id;
            }

            for (const answer of question.answers) {
                if (answer.id) {
                    // Обновляем существующий ответ
                    await answerModel.updateAnswer(answer.id, {
                        text: answer.text,
                        is_correct: answer.isCorrect,
                    });
                } else {
                    // Создаём новый ответ
                    await answerModel.createAnswer({
                        question_id: question.id,
                        text: answer.text,
                        is_correct: answer.isCorrect,
                    });
                }
            }
        }

        res.json({ message: 'Вопросы и ответы успешно обновлены' });
    } catch (error) {
        console.error('Ошибка при обновлении вопросов и ответов:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        await questionModel.deleteQuestion(id);
        res.json({ message: 'Вопрос успешно удалён' });
    } catch (error) {
        console.error('Ошибка при удалении вопроса:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    getQuestionsByTestId,
    createQuestion,
    getQuestionsWithAnswers,
    updateQuestionsAndAnswers,
    deleteQuestion,
};