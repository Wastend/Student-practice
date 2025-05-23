const pool = require('../config/db');
const responsibilityModel = require('./responsibilityModel');
const requirementModel = require('./requirementModel');
const tagModel = require('./tagModel');

const getAllJobs = async (filters) => {
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
    }

    if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
    }

    if (filters.location) {
        query += ' AND location = ?';
        params.push(filters.location);
    }

    const [rows] = await pool.query(query, params);
    return rows;
};

const getJobById = async (id) => {
    console.log('Получение вакансии с ID:', id);
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
    console.log('Результат запроса:', rows[0]);
    
    if (!rows[0]) return null;

    const job = rows[0];
    
    // Получаем обязанности
    job.responsibilities = await responsibilityModel.getResponsibilitiesByJobId(id);
    
    // Получаем требования
    job.requirements = await requirementModel.getRequirementsByJobId(id);
    
    // Получаем теги
    job.tags = await tagModel.getTagsByJobId(id);
    
    console.log('Итоговые данные вакансии:', job);
    return job;
};

const createJob = async (job) => {
    const { 
        title, description, category, location, remote, salary, employer_id, testId,
        responsibilities, requirements, tags,
        work_schedule, employment_type, experience_level, education_level, benefits,
        mentor_support, certificate, possibility_of_employment, paid
    } = job;
    
    // Создаем вакансию
    const [result] = await pool.query(
        `INSERT INTO jobs (
            title, description, category, location, remote, salary, employer_id, test_id,
            work_schedule, employment_type, experience_level, education_level, benefits,
            mentor_support, certificate, possibility_of_employment, paid
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title, description, category, location, remote, salary, employer_id, testId || null,
            work_schedule, employment_type, experience_level, education_level, benefits,
            mentor_support, certificate, possibility_of_employment, paid
        ]
    );
    
    const jobId = result.insertId;
    
    // Добавляем обязанности
    if (responsibilities && responsibilities.length > 0) {
        await responsibilityModel.createResponsibilities(jobId, responsibilities);
    }
    
    // Добавляем требования
    if (requirements && requirements.length > 0) {
        await requirementModel.createRequirements(jobId, requirements);
    }
    
    // Добавляем теги
    if (tags && tags.length > 0) {
        await tagModel.updateJobTags(jobId, tags);
    }
    
    return { id: jobId, ...job };
};

const updateJob = async (id, job) => {
    const { 
        title, description, category, location, remote, salary, testId,
        responsibilities, requirements, tags,
        work_schedule, employment_type, experience_level, education_level, benefits,
        mentor_support, certificate, possibility_of_employment, paid, status
    } = job;
    
    // Обновляем основную информацию о вакансии
    await pool.query(
        `UPDATE jobs SET 
            title = ?, description = ?, category = ?, location = ?, remote = ?, 
            salary = ?, test_id = ?, work_schedule = ?, employment_type = ?,
            experience_level = ?, education_level = ?, benefits = ?,
            mentor_support = ?, certificate = ?, possibility_of_employment = ?, paid = ?,
            status = ?
        WHERE id = ?`,
        [
            title, description, category, location, remote, salary, testId || null,
            work_schedule, employment_type, experience_level, education_level, benefits,
            mentor_support, certificate, possibility_of_employment, paid, status,
            id
        ]
    );
    
    // Обновляем обязанности только если они не пустые
    if (responsibilities && responsibilities.length > 0 && responsibilities.some(r => r.text && r.text.trim())) {
        await responsibilityModel.updateResponsibilities(id, responsibilities);
    }
    
    // Обновляем требования только если они не пустые
    if (requirements && requirements.length > 0 && requirements.some(r => r.text && r.text.trim())) {
        await requirementModel.updateRequirements(id, requirements);
    }
    
    // Обновляем теги
    if (tags) {
        await tagModel.updateJobTags(id, tags);
    }
    
    return { id, ...job };
};

const deleteJob = async (id) => {
    const [result] = await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
    return result;
};

const applyForJob = async (jobId, studentId) => {
    try {
        // Проверяем, не откликался ли уже студент
        const [existing] = await pool.query(
            'SELECT * FROM applications WHERE job_id = ? AND student_id = ?',
            [jobId, studentId]
        );

        if (existing.length > 0) {
            throw new Error('Вы уже откликались на эту вакансию');
        }

        // Создаем отклик
        const [result] = await pool.query(
            'INSERT INTO applications (job_id, student_id, status) VALUES (?, ?, "applied")',
            [jobId, studentId]
        );

        return { id: result.insertId, job_id: jobId, student_id: studentId, status: 'applied' };
    } catch (error) {
        console.error('Ошибка при отклике на вакансию:', error);
        throw error;
    }
};

const getJobApplication = async (jobId, studentId) => {
    const [rows] = await pool.query(
        'SELECT * FROM applications WHERE job_id = ? AND student_id = ?',
        [jobId, studentId]
    );
    return rows[0];
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    applyForJob,
    getJobApplication
};