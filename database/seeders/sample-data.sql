-- SQL script to seed sample data for the Student Employment Platform

-- Insert sample users
INSERT INTO users (username, email, password, role) VALUES
('student1', 'student1@example.com', 'hashed_password1', 'student'),
('student2', 'student2@example.com', 'hashed_password2', 'student'),
('employer1', 'employer1@example.com', 'hashed_password3', 'employer'),
('admin1', 'admin1@example.com', 'hashed_password4', 'admin');

-- Insert sample job postings
INSERT INTO job_postings (title, description, employer_id, created_at) VALUES
('Software Internship', 'An internship position for software development.', 3, NOW()),
('Data Analyst', 'Looking for a data analyst intern.', 3, NOW());

-- Insert sample applications
INSERT INTO applications (student_id, job_posting_id, status, applied_at) VALUES
(1, 1, 'applied', NOW()),
(2, 2, 'applied', NOW());

-- Insert sample tests
INSERT INTO tests (title, description, job_posting_id) VALUES
('Technical Assessment', 'A test to assess technical skills.', 1),
('Data Analysis Test', 'A test to assess data analysis skills.', 2);

-- Insert sample chat messages
INSERT INTO chat_messages (sender_id, receiver_id, message, sent_at) VALUES
(1, 3, 'I am interested in the Software Internship.', NOW()),
(2, 3, 'Can you provide more details about the Data Analyst position?', NOW());