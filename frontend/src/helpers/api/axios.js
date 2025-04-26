import axios from "axios";

export default function initialAxios() {
    axios.defaults.baseURL = "http://localhost:3000/api"; // Убедитесь, что URL соответствует вашему бэкенду

    // Добавляем токен в заголовки
    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Обработка ошибок
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error("Ошибка API:", error.response?.data || error.message);
            return Promise.reject(error);
        }
    );
}
