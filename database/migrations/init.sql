CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('student', 'employer', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    salary DECIMAL(10, 2),
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employer_id INT,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    student_id INT,
    status ENUM('applied', 'interview', 'rejected', 'accepted') DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    test_name VARCHAR(100) NOT NULL,
    test_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT,
    student_id INT,
    score DECIMAL(5, 2),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);