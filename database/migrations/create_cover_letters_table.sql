-- Создание таблицы для сопроводительных писем
CREATE TABLE cover_letters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Добавление колонки cover_letter_id в таблицу applications
ALTER TABLE applications
ADD COLUMN cover_letter_id INT,
ADD FOREIGN KEY (cover_letter_id) REFERENCES cover_letters(id) ON DELETE SET NULL; 