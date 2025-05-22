import { setAuthToken } from '../api';

// Инициализация токена при загрузке приложения
const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

// Функция для сохранения токена
export const saveToken = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
};

// Функция для удаления токена
export const removeToken = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
};

// Функция для проверки наличия токена
export const hasToken = () => {
    return !!localStorage.getItem('token');
}; 