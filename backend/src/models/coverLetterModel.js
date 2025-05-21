const pool = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/cover-letters');

// Создание директории для загрузки файлов, если она не существует
const ensureUploadDir = async () => {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
};

const createCoverLetter = async (userId, file) => {
    await ensureUploadDir();

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Сохраняем файл
    await fs.writeFile(filePath, file.buffer);

    // Сохраняем информацию в базу данных
    const [result] = await pool.query(
        'INSERT INTO cover_letters (user_id, file_name, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?)',
        [userId, file.originalname, fileName, file.size, file.mimetype]
    );

    return {
        id: result.insertId,
        name: file.originalname,
        path: fileName
    };
};

const getCoverLetterById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM cover_letters WHERE id = ?',
        [id]
    );
    return rows[0];
};

const getCoverLetterByUserId = async (userId) => {
    const [rows] = await pool.query(
        'SELECT * FROM cover_letters WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
    );
    return rows[0];
};

const deleteCoverLetter = async (id) => {
    const coverLetter = await getCoverLetterById(id);
    if (!coverLetter) {
        throw new Error('Cover letter not found');
    }

    // Удаляем файл
    const filePath = path.join(UPLOAD_DIR, coverLetter.file_path);
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error('Error deleting file:', error);
    }

    // Удаляем запись из базы данных
    await pool.query('DELETE FROM cover_letters WHERE id = ?', [id]);
};

const getCoverLetterFile = async (id) => {
    const coverLetter = await getCoverLetterById(id);
    if (!coverLetter) {
        throw new Error('Cover letter not found');
    }

    const filePath = path.join(UPLOAD_DIR, coverLetter.file_path);
    try {
        const fileBuffer = await fs.readFile(filePath);
        return {
            buffer: fileBuffer,
            fileName: coverLetter.file_name,
            mimeType: coverLetter.file_type
        };
    } catch (error) {
        throw new Error('Error reading file');
    }
};

module.exports = {
    createCoverLetter,
    getCoverLetterById,
    getCoverLetterByUserId,
    deleteCoverLetter,
    getCoverLetterFile
}; 