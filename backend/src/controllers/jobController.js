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
        const newJob = await jobModel.createJob(req.body);
        res.status(201).json(newJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
};