-- Добавление колонки conditions в таблицу jobs
ALTER TABLE jobs
ADD COLUMN conditions TEXT DEFAULT NULL; 