import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

export async function checkAuth() {
    const authStore = useAuthStore();
    const token = localStorage.getItem('token');

    if (token && !authStore.user) {
        try {
            // Устанавливаем токен в заголовок
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Получаем данные пользователя
            const response = await axios.get('http://localhost:3000/api/users/me');
            
            // Сохраняем пользователя в store
            authStore.setUser(response.data);
            authStore.setToken(token);
            
            return true;
        } catch (error) {
            console.error('Ошибка при проверке авторизации:', error);
            // Если токен невалидный, очищаем данные
            authStore.logout();
            return false;
        }
    }
    
    return !!authStore.user;
} 