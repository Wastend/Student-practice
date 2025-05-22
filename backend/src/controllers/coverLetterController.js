const multer = require('multer');
const path = require('path');
const { createCoverLetter, getCoverLetterByUserId, deleteCoverLetter, getCoverLetterFile } = require('../models/coverLetterModel');

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            // Декодируем имя файла
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            cb(null, true);
        } else {
            cb(new Error('Неподдерживаемый формат файла'));
        }
    },
});

// Загрузка файла
const uploadCoverLetter = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const result = await createCoverLetter(req.user.id, req.file);
            res.json(result);
        } catch (error) {
            console.error('Error uploading cover letter:', error);
            res.status(500).json({ message: 'Error uploading file' });
        }
    });
};

// Получение информации о файле
const getCoverLetter = async (req, res) => {
    try {
        const coverLetter = await getCoverLetterByUserId(req.user.id);
        if (!coverLetter) {
            return res.status(404).json({ message: 'Сопроводительное письмо не найдено' });
        }
        res.json(coverLetter);
    } catch (error) {
        console.error('Ошибка при получении файла:', error);
        res.status(500).json({ message: 'Ошибка при получении файла' });
    }
};

// Скачивание файла
const downloadCoverLetter = async (req, res) => {
    try {
        const file = await getCoverLetterFile(req.params.id);
        
        // Устанавливаем заголовки для скачивания
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`);
        res.setHeader('Content-Length', file.buffer.length);
        
        // Отправляем файл
        res.send(file.buffer);
    } catch (error) {
        console.error('Error downloading cover letter:', error);
        if (error.message === 'File not found on disk') {
            res.status(404).json({ message: 'File not found on server' });
        } else {
            res.status(500).json({ message: 'Error downloading file' });
        }
    }
};

// Удаление файла
const deleteCoverLetterHandler = async (req, res) => {
    try {
        await deleteCoverLetter(req.params.id);
        res.json({ message: 'Cover letter deleted successfully' });
    } catch (error) {
        console.error('Error deleting cover letter:', error);
        res.status(500).json({ message: 'Error deleting file' });
    }
};

module.exports = {
    uploadCoverLetter,
    getCoverLetter,
    downloadCoverLetter,
    deleteCoverLetter: deleteCoverLetterHandler
}; 