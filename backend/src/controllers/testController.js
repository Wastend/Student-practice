const testModel = require('../models/testModel');

const getAllTests = async (req, res) => {
    try {
        const tests = await testModel.getAllTests();
        res.json(tests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const getTestById = async (req, res) => {
    try {
        const test = await testModel.getTestById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Тест не найден' });
        }
        res.json(test);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const createTest = async (req, res) => {
    try {
        const { job_id, title, description } = req.body;
        const newTest = await testModel.createTest({ job_id, title, description });
        res.status(201).json(newTest);
    } catch (error) {
        console.error("Ошибка при создании теста:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const submitTest = async (req, res) => {
    const { testId } = req.params;
    const { answers } = req.body;

    try {
        // Логика проверки ответов и подсчёта результата
        const score = calculateScore(answers);
        await testModel.saveTestResult({
            test_id: testId,
            student_id: req.user.id,
            score,
        });
        res.json({ message: 'Тест успешно пройден', score });
    } catch (error) {
        console.error('Ошибка при отправке теста:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
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
        await testModel.updateTest(id, { title, description });
        res.json({ message: "Тест успешно обновлён" });
    } catch (error) {
        console.error("Ошибка при обновлении теста:", error);
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
};