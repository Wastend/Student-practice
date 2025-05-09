const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const testController = require('../controllers/testController');
const questionController = require('../controllers/questionController');
const answerController = require('../controllers/answerController');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/authMiddleware');

// Маршруты для пользователей
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.post('/login', userController.loginUser); // Используем метод из userController
router.post('/register', userController.registerUser);
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);

// Маршруты для вакансий
router.get('/jobs', jobController.getAllJobs);
router.get('/jobs/:id', authenticateToken, jobController.getJobById);
router.post('/jobs', authenticateToken, jobController.createJob);
router.put('/jobs/:id', authenticateToken, jobController.updateJob);
router.delete('/jobs/:id', authenticateToken, jobController.deleteJob);

// Маршруты для заявок
router.get('/applications', applicationController.getAllApplications);
router.get('/applications/:id', applicationController.getApplicationById);
router.post('/applications', applicationController.createApplication);

// Маршруты для тестов
router.get('/tests', authenticateToken, testController.getAllTests);
router.get('/tests/:id', authenticateToken, testController.getTestById);
router.post('/tests', authenticateToken, testController.createTest);
router.post('/tests/:testId/submit', authenticateToken, testController.submitTest);
router.put('/tests/:id', authenticateToken, testController.updateTest);
router.delete('/tests/:id', authenticateToken, testController.deleteTest);

// Маршруты для вопросов
router.get('/tests/:testId/questions', questionController.getQuestionsByTestId);
router.post('/tests/:testId/questions', authenticateToken, questionController.createQuestion);
router.get('/tests/:testId/questions-with-answers', authenticateToken, questionController.getQuestionsWithAnswers);
router.put('/tests/:testId/questions', authenticateToken, questionController.updateQuestionsAndAnswers);
router.delete('/questions/:id', authenticateToken, questionController.deleteQuestion);

// Маршруты для ответов
router.get('/questions/:questionId/answers', answerController.getAnswersByQuestionId);
router.post('/questions/:questionId/answers', authenticateToken, answerController.createAnswer);
router.delete('/answers/:id', authenticateToken, answerController.deleteAnswer);

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Доступ разрешён', user: req.user });
});

router.get('/', (req, res) => {
    res.send('API is working!');
});

module.exports = router;