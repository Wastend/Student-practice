const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

// Получение всех заявок (с фильтрацией по student_id)
router.get('/', authMiddleware, applicationController.getAllApplications);

// Получение заявок компании
router.get('/company', authMiddleware, applicationController.getCompanyApplications);

// Получение заявки по ID
router.get('/:id', authMiddleware, applicationController.getApplicationById);

// Создание новой заявки
router.post('/', authMiddleware, applicationController.createApplication);

// Обновление статуса заявки
router.patch('/:id/status', authMiddleware, applicationController.updateApplicationStatus);

module.exports = router; 