# Student Employment Platform

This project is a web platform designed to connect students, universities, and employers, facilitating internship and job opportunities for students. The platform allows students to register, create profiles, search for jobs, apply for positions, take online tests, and communicate with employers. Employers can post job vacancies, filter candidates, and manage applications. Administrators can moderate content and track system activity.

## Project Structure

The project is organized into three main directories:

- **backend**: Contains the server-side code, including API endpoints, database models, and business logic.
- **database**: Contains SQL scripts for database schema, migrations, and sample data.
- **frontend**: Contains the client-side code built with Vue.js, including components, views, and state management.

## Technologies Used

- **Backend**: Node.js, Express, MySQL
- **Frontend**: Vue 3, Composition API
- **Database**: MySQL
- **Authentication**: JWT
- **Styling**: CSS (with support for responsive design)

## Features

### For Students
- User registration and profile creation
- Job search and filtering
- Application submission
- Online testing
- Chat functionality with employers
- Notifications for job updates

### For Employers
- Job posting and management
- Candidate filtering based on criteria and test results
- Communication with applicants
- Application management

### For Administrators
- User and job vacancy moderation
- Test management
- Activity tracking and statistics

## Setup Instructions

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the database connection in the environment variables or configuration file.
4. Run migrations to set up the database:
   ```
   npm run migrate
   ```
5. Start the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run serve
   ```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.