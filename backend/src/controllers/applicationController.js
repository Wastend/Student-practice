const applicationModel = require('../models/applicationModel');

const getAllApplications = async (req, res) => {
    try {
        const applications = await applicationModel.getAllApplications();
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

module.exports = {
    getAllApplications,
    getApplicationById,
    createApplication,
};