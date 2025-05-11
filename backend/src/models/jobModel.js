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
        mentor_support, certificate, possibility_of_employment, paid
    } = job;
    
    // Обновляем основную информацию о вакансии
    await pool.query(
        `UPDATE jobs SET 
            title = ?, description = ?, category = ?, location = ?, remote = ?, 
            salary = ?, test_id = ?, work_schedule = ?, employment_type = ?,
            experience_level = ?, education_level = ?, benefits = ?,
            mentor_support = ?, certificate = ?, possibility_of_employment = ?, paid = ?
        WHERE id = ?`,
        [
            title, description, category, location, remote, salary, testId || null,
            work_schedule, employment_type, experience_level, education_level, benefits,
            mentor_support, certificate, possibility_of_employment, paid,
            id
        ]
    );
    
    // Обновляем обязанности
    if (responsibilities) {
        await responsibilityModel.updateResponsibilities(id, responsibilities);
    }
    
    // Обновляем требования
    if (requirements) {
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

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
};