CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('applied', 'interview', 'rejected', 'accepted') DEFAULT 'applied',
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cover_letter_id INT DEFAULT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (cover_letter_id) REFERENCES cover_letters(id) ON DELETE SET NULL
); 