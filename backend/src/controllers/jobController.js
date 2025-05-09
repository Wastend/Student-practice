const jobModel = require('../models/jobModel');

const getAllJobs = async (req, res) => {
    try {
        const jobs = await jobModel.getAllJobs(req.query);
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
        const { title, description, category, location, remote, salary, employer_id, deadline, testId } = req.body;

        // Убедитесь, что testId — это число или null
        const newJob = await jobModel.createJob({
            title,
            description,
            category,
            location,
            remote,
            salary,
            employer_id: req.user.id, // Используем ID текущего пользователя
            deadline,
            testId: testId || null,
        });
        res.status(201).json(newJob);
    } catch (error) {
        console.error("Ошибка при создании вакансии:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = req.body;

        const existingJob = await jobModel.getJobById(id);
        if (!existingJob || existingJob.employer_id !== req.user.id) {
            return res.status(404).json({ message: 'Вакансия не найдена или у вас нет доступа' });
        }

        await jobModel.updateJob(id, job);
        res.json({ message: 'Вакансия успешно обновлена' });
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

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};