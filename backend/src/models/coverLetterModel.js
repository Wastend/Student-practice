const db = require('../config/db');
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

    console.log('Saving file:', {
        originalName: file.originalname,
        fileName,
        filePath,
        size: file.size,
        mimetype: file.mimetype
    });

    // Сохраняем файл
    await fs.writeFile(filePath, file.buffer);

    // Сохраняем информацию в базу данных
    const query = `
        INSERT INTO cover_letters (
            user_id, 
            name, 
            file_name, 
            file_path, 
            file_size,
            file_type
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
        userId, 
        file.originalname, // name - оригинальное имя файла
        file.originalname, // file_name - тоже оригинальное имя файла
        fileName, // file_path - имя файла с timestamp
        file.size, // file_size - размер файла в байтах
        file.mimetype // file_type - MIME-тип файла
    ]);

    console.log('File saved to database:', {
        id: result.insertId,
        name: file.originalname,
        path: fileName
    });

    return {
        id: result.insertId,
        name: file.originalname,
        path: fileName
    };
};

const getCoverLetterById = async (id) => {
    const query = `
        SELECT * FROM cover_letters
        WHERE id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

const getCoverLetterByUserId = async (userId) => {
    const query = `
        SELECT id, name, file_name, file_path, file_size, file_type, created_at, updated_at
        FROM cover_letters
        WHERE user_id = ?
    `;
    const [rows] = await db.execute(query, [userId]);
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
    const query = `
        DELETE FROM cover_letters
        WHERE id = ?
    `;
    await db.execute(query, [id]);
};

const getCoverLetterFile = async (id) => {
    const coverLetter = await getCoverLetterById(id);
    if (!coverLetter) {
        throw new Error('Cover letter not found');
    }

    console.log('Getting file:', {
        id,
        coverLetter
    });

    const filePath = path.join(UPLOAD_DIR, coverLetter.file_path);
    try {
        // Проверяем существование файла
        await fs.access(filePath);
        
        const fileBuffer = await fs.readFile(filePath);
        return {
            buffer: fileBuffer,
            fileName: coverLetter.name,
            mimeType: coverLetter.file_type || 'application/octet-stream'
        };
    } catch (error) {
        console.error('Error reading file:', error);
        if (error.code === 'ENOENT') {
            throw new Error('File not found on disk');
        }
        throw new Error('Error reading file');
    }
};

class CoverLetter {
    static async create(userId, fileName, filePath) {
        const query = `
            INSERT INTO cover_letters (user_id, name, file_path)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.execute(query, [userId, fileName, filePath]);
        return result.insertId;
    }

    static async getByUserId(userId) {
        const query = `
            SELECT * FROM cover_letters
            WHERE user_id = ?
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows[0];
    }

    static async delete(id) {
        const query = `
            DELETE FROM cover_letters
            WHERE id = ?
        `;
        await db.execute(query, [id]);
    }
}

module.exports = {
    createCoverLetter,
    getCoverLetterById,
    getCoverLetterByUserId,
    deleteCoverLetter,
    getCoverLetterFile,
    CoverLetter
}; 