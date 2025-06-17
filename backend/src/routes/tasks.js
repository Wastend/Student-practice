const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const taskModel = require('../models/taskModel');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/tasks')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Получение списка заданий для вакансии
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { vacancy_id } = req.query;
        const tasks = await taskModel.getByVacancyId(vacancy_id);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Создание нового задания (только для работодателя)
router.post('/', authenticateToken, checkRole('employer'), upload.single('file'), async (req, res) => {
    try {
        const { description, vacancy_id } = req.body;
        const file_url = req.file ? `/uploads/tasks/${req.file.filename}` : null;
        
        const taskId = await taskModel.create({
            description,
            vacancy_id,
            file_url
        });

        res.status(201).json({ id: taskId, message: 'Задание успешно создано' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Отправка ответа на задание (только для студента)
router.post('/:taskId/response', authenticateToken, checkRole('student'), upload.single('file'), async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;
        const fileUrl = req.file ? `/uploads/tasks/${req.file.filename}` : null;

        const success = await taskModel.submitResponse(taskId, req.user.id, text, fileUrl);
        
        if (!success) {
            return res.status(400).json({ message: 'Не удалось отправить ответ на задание' });
        }

        res.json({ message: 'Ответ успешно отправлен' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Принятие задания (только для работодателя)
router.post('/:taskId/approve', authenticateToken, checkRole('employer'), async (req, res) => {
    try {
        const { taskId } = req.params;
        const success = await taskModel.updateStatus(taskId, 'approved');
        
        if (!success) {
            return res.status(400).json({ message: 'Не удалось обновить статус задания' });
        }

        res.json({ message: 'Задание принято' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Отклонение задания (только для работодателя)
router.post('/:taskId/reject', authenticateToken, checkRole('employer'), async (req, res) => {
    try {
        const { taskId } = req.params;
        const success = await taskModel.updateStatus(taskId, 'rejected');
        
        if (!success) {
            return res.status(400).json({ message: 'Не удалось обновить статус задания' });
        }

        res.json({ message: 'Задание отклонено' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Отклонение и блокировка задания (только для работодателя)
router.post('/:taskId/reject-and-block', authenticateToken, checkRole('employer'), async (req, res) => {
    try {
        const { taskId } = req.params;
        const success = await taskModel.updateStatus(taskId, 'blocked');
        
        if (!success) {
            return res.status(400).json({ message: 'Не удалось обновить статус задания' });
        }

        res.json({ message: 'Задание отклонено и заблокировано' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 