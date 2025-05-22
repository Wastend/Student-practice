-- Добавление новых полей в таблицу jobs
ALTER TABLE jobs
ADD COLUMN work_schedule VARCHAR(50) DEFAULT NULL,
ADD COLUMN employment_type VARCHAR(50) DEFAULT NULL,
ADD COLUMN experience_level VARCHAR(50) DEFAULT NULL,
ADD COLUMN education_level VARCHAR(50) DEFAULT NULL,
ADD COLUMN benefits TEXT DEFAULT NULL; 