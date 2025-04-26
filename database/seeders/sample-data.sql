USE student_practice_platform;

-- Роли
INSERT INTO roles (name) VALUES ('student'), ('company'), ('admin');

-- Пользователи
INSERT INTO users (username, email, password, role_id, company_name, company_website, company_description)
VALUES
('student1', 'student1@example.com', 'hashed_password', 1, NULL, NULL, NULL),
('company1', 'company1@example.com', 'hashed_password', 2, 'Tech Corp', 'https://techcorp.com', 'Leading tech company'),
('admin1', 'admin1@example.com', 'hashed_password', 3, NULL, NULL, NULL);

-- Вакансии
INSERT INTO jobs (title, description, category, location, remote, salary, employer_id, deadline)
VALUES
('Frontend Developer', 'Develop and maintain web applications.', 'IT', 'Moscow', TRUE, 120000, 2, '2025-05-30'),
('HR Specialist', 'Manage recruitment and employee relations.', 'HR', 'Saint Petersburg', FALSE, 80000, 2, '2025-06-15');

-- Заявки
INSERT INTO applications (job_id, student_id, status)
VALUES
(1, 1, 'applied'),
(2, 1, 'interview');

-- Тесты
INSERT INTO tests (job_id, title, description)
VALUES
(1, 'JavaScript Basics', 'Test your knowledge of JavaScript basics.');

-- Вопросы тестов
INSERT INTO test_questions (test_id, text)
VALUES
(1, 'What is a closure in JavaScript?');

-- Ответы на вопросы
INSERT INTO test_answers (question_id, text, is_correct)
VALUES
(1, 'A function with its lexical scope.', TRUE),
(1, 'A global variable.', FALSE);

-- Результаты тестов
INSERT INTO test_results (test_id, student_id, score)
VALUES
(1, 1, 85.5);

-- Теги
INSERT INTO tags (name)
VALUES
('JavaScript'), ('Remote'), ('Full-time');

-- Связь вакансий и тегов
INSERT INTO job_tags (job_id, tag_id)
VALUES
(1, 1), (1, 2);

-- Сообщения
INSERT INTO messages (sender_id, receiver_id, message)
VALUES
(1, 2, 'Hello, I am interested in the Frontend Developer position.');