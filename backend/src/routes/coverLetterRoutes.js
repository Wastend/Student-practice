const express = require('express');
const router = express.Router();
const coverLetterController = require('../controllers/coverLetterController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Все роуты требуют аутентификации
router.use(authenticateToken);

// Загрузка файла
router.post('/upload', coverLetterController.uploadCoverLetter);

// Получение информации о файле
router.get('/', coverLetterController.getCoverLetter);

// Скачивание файла
router.get('/:id/download', coverLetterController.downloadCoverLetter);

// Удаление файла
router.delete('/:id', coverLetterController.deleteCoverLetter);

module.exports = router; 