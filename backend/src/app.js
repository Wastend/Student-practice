require('dotenv').config();
const express = require('express');
const cors = require('cors');
const indexRoutes = require('./routes/index');
const coverLetterRoutes = require('./routes/coverLetterRoutes');

const app = express();

// Настройка CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 часа
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Проверка доступности сервера
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Основные роуты
app.use('/api', indexRoutes);
app.use('/api/cover-letters', coverLetterRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Внутренняя ошибка сервера',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});