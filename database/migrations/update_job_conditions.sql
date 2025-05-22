-- Удаление старой колонки conditions
ALTER TABLE jobs
DROP COLUMN conditions;

-- Добавление новых колонок для условий
ALTER TABLE jobs
ADD COLUMN mentor_support BOOLEAN DEFAULT FALSE,
ADD COLUMN certificate BOOLEAN DEFAULT FALSE,
ADD COLUMN possibility_of_employment BOOLEAN DEFAULT FALSE,
ADD COLUMN paid BOOLEAN DEFAULT FALSE; 