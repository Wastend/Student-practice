const express = require('express');
const router = express.Router();
const coverLetterController = require('../controllers/coverLetterController');
const authMiddleware = require('../middleware/authMiddleware');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Загрузка сопроводительного письма
router.post('/', coverLetterController.uploadCoverLetter);

// Получение сопроводительного письма по ID
router.get('/:id', coverLetterController.getCoverLetter);

// Получение сопроводительного письма текущего пользователя
router.get('/user/current', coverLetterController.getUserCoverLetter);

// Удаление сопроводительного письма
router.delete('/:id', coverLetterController.deleteCoverLetter);

// Скачивание сопроводительного письма
router.get('/:id/download', coverLetterController.downloadCoverLetter);

module.exports = router; 