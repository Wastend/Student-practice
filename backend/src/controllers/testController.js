const testModel = require('../models/testModel');
const questionModel = require('../models/questionModel');
const answerModel = require('../models/answerModel');

const getAllTests = async (req, res) => {
    try {
        const employerId = req.user.id; // ID текущего пользователя
        const tests = await testModel.getTestsByEmployerId(employerId);
        res.json(tests);
    } catch (error) {
        console.error("Ошибка при получении тестов:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const getTestById = async (req, res) => {
    try {        
        console.log('Получение теста с ID:', req.params.id);
        const test = await testModel.getTestById(req.params.id);

        // Проверяем, существует ли тест
        if (!test) {
            console.log('Тест не найден');
            return res.status(404).json({ message: 'Тест не найден' });
        }
        console.log('Тест найден:', test);

        // Получаем вопросы для теста
        const questions = await questionModel.getQuestionsByTestId(test.id);
        console.log('Вопросы для теста:', questions);
        
        // Для каждого вопроса получаем ответы
        const questionsWithAnswers = await Promise.all(
            questions.map(async (question) => {
                const answers = await answerModel.getAnswersByQuestionId(question.id);
                console.log(`Ответы для вопроса ${question.id}:`, answers);
                return {
                    ...question,
                    answers: answers
                };
            })
        );

        // Добавляем вопросы с ответами к тесту
        const testWithQuestions = {
            ...test,
            questions: questionsWithAnswers
        };
        console.log('Итоговый объект теста:', testWithQuestions);

        res.json(testWithQuestions);
    } catch (error) {
        console.error("Ошибка при получении теста:", error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const createTest = async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTest = await testModel.createTest({
            employer_id: req.user.id, // Привязываем тест к работодателю
            title,
            description,
        });
        res.status(201).json(newTest);
    } catch (error) {
        console.error("Ошибка при создании теста:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const submitTest = async (req, res) => {
    const { id } = req.params;
    const { answers } = req.body;

    try {
        // Получаем тест с вопросами и правильными ответами
        const test = await testModel.getTestById(id);
        if (!test) {
            return res.status(404).json({ message: "Тест не найден" });
        }

        const questions = await questionModel.getQuestionsByTestId(id);
        let totalQuestions = questions.length;
        let correctAnswers = 0;

        // Проверяем каждый ответ
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const questionAnswers = await answerModel.getAnswersByQuestionId(question.id);
            const correctAnswer = questionAnswers.find(answer => answer.is_correct);
            
            if (correctAnswer && answers[i] === correctAnswer.id) {
                correctAnswers++;
            }
        }

        // Вычисляем процент правильных ответов
        const score = (correctAnswers / totalQuestions) * 100;

        // Сохраняем результат
        const result = await testModel.saveTestResult({
            test_id: id,
            student_id: req.user.id,
            score: score
        });

        res.json({ 
            message: "Тест успешно отправлен",
            score: score,
            correctAnswers,
            totalQuestions
        });
    } catch (error) {
        console.error("Ошибка при отправке теста:", error);
        res.status(500).json({ message: "Ошибка при отправке теста" });
    }
};

const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        await testModel.deleteTest(id);
        res.json({ message: "Тест успешно удалён" });
    } catch (error) {
        console.error("Ошибка при удалении теста:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        // Проверяем, принадлежит ли тест текущему пользователю
        const test = await testModel.getTestById(id);
        if (!test || test.employer_id !== req.user.id) {
            return res.status(404).json({ message: 'Тест не найден или у вас нет доступа' });
        }

        await testModel.updateTest(id, { title, description });
        res.json({ message: "Тест успешно обновлён" });
    } catch (error) {
        console.error("Ошибка при обновлении теста:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const takeTest = async (req, res) => {
    try {
        const test = await testModel.getTestById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: "Тест не найден" });
        }

        res.json(test);
    } catch (error) {
        console.error("Ошибка при получении теста:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

module.exports = {
    getAllTests,
    getTestById,
    createTest,
    submitTest,
    deleteTest,
    updateTest,
    takeTest,
};