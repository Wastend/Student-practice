const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', tagController.getAllTags);
router.post('/', authenticateToken, tagController.createTag);

module.exports = router; 