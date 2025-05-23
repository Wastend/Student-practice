const applicationModel = require('../models/applicationModel');

const getAllApplications = async (req, res) => {
    try {
        const filters = {};
        if (req.query.student_id) {
            filters.student_id = req.query.student_id;
        }
        const applications = await applicationModel.getAllApplications(filters);
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const getCompanyApplications = async (req, res) => {
    try {
        const applications = await applicationModel.getCompanyApplications(req.user.id);
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const application = await applicationModel.getApplicationById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Заявка не найдена' });
        }
        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const createApplication = async (req, res) => {
    try {
        const newApplication = await applicationModel.createApplication(req.body);
        res.status(201).json(newApplication);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await applicationModel.updateApplicationStatus(req.params.id, status);
        if (!application) {
            return res.status(404).json({ message: 'Заявка не найдена' });
        }
        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = {
    getAllApplications,
    getCompanyApplications,
    getApplicationById,
    createApplication,
    updateApplicationStatus
};