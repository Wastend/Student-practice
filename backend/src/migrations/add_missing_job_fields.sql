-- Добавляем только недостающие поля
ALTER TABLE jobs
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP; 