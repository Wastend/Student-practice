const express = require('express');
const router = express.Router();

// Import controllers
const studentController = require('../controllers/studentController');
const employerController = require('../controllers/employerController');
const adminController = require('../controllers/adminController');

// Student routes
router.post('/students', studentController.register);
router.get('/students', studentController.getAll);
router.get('/students/:id', studentController.getById);
router.put('/students/:id', studentController.update);
router.delete('/students/:id', studentController.delete);

// Employer routes
router.post('/employers', employerController.register);
router.get('/employers', employerController.getAll);
router.get('/employers/:id', employerController.getById);
router.put('/employers/:id', employerController.update);
router.delete('/employers/:id', employerController.delete);

// Admin routes
router.get('/admin/stats', adminController.getStats);
router.post('/admin/moderate', adminController.moderateContent);

module.exports = router;