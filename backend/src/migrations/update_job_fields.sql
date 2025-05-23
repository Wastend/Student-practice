-- Обновляем значения полей для существующей вакансии
UPDATE jobs 
SET 
    category = 'development',
    work_schedule = 'full_time',
    employment_type = 'full_time',
    experience_level = 'no_experience',
    education_level = 'bachelor',
    benefits = 'Официальное трудоустройство, гибкий график, обучение',
    mentor_support = true,
    certificate = true
WHERE id = 1; 