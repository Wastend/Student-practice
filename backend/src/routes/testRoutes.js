const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, testController.getAllTests);
router.get('/:id', testController.getTestById);
router.post('/', authenticateToken, testController.createTest);
router.put('/:id', authenticateToken, testController.updateTest);
router.delete('/:id', authenticateToken, testController.deleteTest);
router.get('/:id/take', authenticateToken, testController.takeTest);
router.post('/:id/submit', authenticateToken, testController.submitTest);

module.exports = router; 