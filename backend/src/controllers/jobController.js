const jobModel = require('../models/jobModel');
const jobApplicationModel = require('../models/jobApplicationModel');
const { Configuration, OpenAIApi } = require("openai");
const { OpenAI } = require("openai");

const getAllJobs = async (req, res) => {
    try {
        const filters = req.query;
        const jobs = await jobModel.getAllJobs(filters);
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await jobModel.getJobById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }
        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const createJob = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            category, 
            location, 
            remote, 
            salary, 
            deadline, 
            testId, 
            status,
            responsibilities,
            requirements,
            tags,
            work_schedule,
            employment_type,
            experience_level,
            education_level,
            benefits,
            mentor_support,
            certificate,
            possibility_of_employment,
            paid
        } = req.body;

        // Получаем только ID тегов
        const tagIds = tags ? tags.map(tag => tag.id) : [];

        const newJob = await jobModel.createJob({
            title,
            description,
            category,
            location,
            remote,
            salary,
            employer_id: req.user.id,
            deadline,
            testId: testId || null,
            status: status || 'draft',
            responsibilities,
            requirements,
            tags: tagIds,
            work_schedule,
            employment_type,
            experience_level,
            education_level,
            benefits,
            mentor_support,
            certificate,
            possibility_of_employment,
            paid
        });

        // Получаем полную информацию о вакансии с тегами
        const fullJob = await jobModel.getJobById(newJob.id);
        res.status(201).json(fullJob);
    } catch (error) {
        console.error("Ошибка при создании вакансии:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = req.body;

        // Получаем только ID тегов, фильтруем null и undefined
        if (job.tags) {
            job.tags = job.tags
                .map(tag => typeof tag === 'object' ? tag.id : tag)
                .filter(id => id !== null && id !== undefined);
        }

        const existingJob = await jobModel.getJobById(id);
        if (!existingJob || existingJob.employer_id !== req.user.id) {
            return res.status(404).json({ message: 'Вакансия не найдена или у вас нет доступа' });
        }

        await jobModel.updateJob(id, job);
        
        // Получаем обновленную вакансию с тегами
        const updatedJob = await jobModel.getJobById(id);
        res.json(updatedJob);
    } catch (error) {
        console.error('Ошибка при обновлении вакансии:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const existingJob = await jobModel.getJobById(id);
        if (!existingJob || existingJob.employer_id !== req.user.id) {
            return res.status(404).json({ message: 'Вакансия не найдена или у вас нет доступа' });
        }

        await jobModel.deleteJob(id);
        res.json({ message: 'Вакансия успешно удалена' });
    } catch (error) {
        console.error('Ошибка при удалении вакансии:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const generateTest = async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ message: "Тема теста не указана" });
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `Сгенерируй тест по теме "${topic}". Включи 3 вопроса с 4 вариантами ответов, где один из них правильный. Верни в формате JSON: [{ "text": "Вопрос", "answers": [{ "text": "Ответ", "isCorrect": true/false }] }]`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
        });

        const generatedTest = JSON.parse(response.choices[0].message.content.trim());
        
        res.json({ questions: generatedTest });
    } catch (error) {
        console.error("Ошибка при генерации теста:", error);
        res.status(500).json({ message: "Ошибка при генерации теста" });
    }
};

const applyForJob = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.user.id;

        // Проверяем существование вакансии
        const job = await jobModel.getJobById(id);
        if (!job) {
            return res.status(404).json({ message: 'Вакансия не найдена' });
        }

        // Создаем отклик
        const application = await jobModel.applyForJob(id, studentId);
        res.status(201).json(application);
    } catch (error) {
        console.error('Ошибка при отклике на вакансию:', error);
        if (error.message === 'Вы уже откликались на эту вакансию') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    generateTest,
    applyForJob
};