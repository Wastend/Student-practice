import { useAuthStore } from '@/stores/auth';
import { setAuthToken } from '../../api';

export default function initAuth() {
    const authStore = useAuthStore();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token) {
        setAuthToken(token);
        authStore.setToken(token);
    }

    if (user) {
        authStore.setUser(user);
    }
} 