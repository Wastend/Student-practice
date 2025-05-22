const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Все роуты требуют аутентификации
router.use(authMiddleware);

// Здесь будут другие роуты для работы с пользователями
// Например, получение списка пользователей, поиск и т.д.

module.exports = router; 