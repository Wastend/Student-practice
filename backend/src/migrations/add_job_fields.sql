-- Добавляем новые поля в таблицу jobs
ALTER TABLE jobs
ADD COLUMN work_schedule VARCHAR(50) NULL,
ADD COLUMN employment_type VARCHAR(50) NULL,
ADD COLUMN experience_level VARCHAR(50) NULL,
ADD COLUMN education_level VARCHAR(50) NULL,
ADD COLUMN benefits TEXT NULL,
ADD COLUMN mentor_support BOOLEAN DEFAULT false,
ADD COLUMN certificate BOOLEAN DEFAULT false,
ADD COLUMN possibility_of_employment BOOLEAN DEFAULT false,
ADD COLUMN paid BOOLEAN DEFAULT false,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Обновляем существующие записи
UPDATE jobs 
SET 
    work_schedule = 'full_time',
    employment_type = 'full_time',
    experience_level = 'no_experience',
    education_level = 'bachelor',
    benefits = 'Официальное трудоустройство, гибкий график',
    mentor_support = true,
    certificate = true,
    possibility_of_employment = true,
    paid = true
WHERE work_schedule IS NULL; 