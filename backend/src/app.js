require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Импортируем CORS
const routes = require('./routes/index');

const app = express();

// Настройка CORS
app.use(cors({
    origin: 'http://localhost:5173', // Разрешаем запросы с фронтенда
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешённые методы
    credentials: true, // Если используются куки
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});