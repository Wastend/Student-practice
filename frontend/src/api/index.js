import axios from "axios";

// Создаем экземпляр axios с настройками
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000, // 10 секунд таймаут
    headers: {
        'Content-Type': 'application/json'
    }
});

// Добавляем перехватчик для обработки ошибок
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        if (error.code === 'ERR_NETWORK') {
            // Проверяем доступность сервера
            try {
                await axios.get('http://localhost:3000/api/health');
                // Если сервер доступен, повторяем запрос
                return axiosInstance(error.config);
            } catch (e) {
                console.error('Сервер недоступен:', e);
                throw new Error('Сервер временно недоступен. Пожалуйста, попробуйте позже.');
            }
        }
        return Promise.reject(error);
    }
);

// Функция для установки токена
export const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};

// Авторизация
export const login = async (email, password) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
};

// Работа с вакансиями
export const getJobs = async (filters = {}) => {
    const response = await axiosInstance.get("/jobs", { params: filters });
    console.log(response);
    
    return response.data;
};

export const getJobById = async (id) => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
};

export const createJob = async (jobData) => {
    const response = await axiosInstance.post("/jobs", jobData);
    return response.data;
};

export const updateJob = async (id, jobData) => {
    const response = await axiosInstance.put(`/jobs/${id}`, jobData);
    return response.data;
};

export const deleteJob = async (id) => {    
    const response = await axiosInstance.delete(`/jobs/${id}`);
    return response.data;
};

// Работа с заявками
export const getApplications = async (filters = {}) => {
    try {
        const response = await axiosInstance.get("/applications", { params: filters });
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return []; // Возвращаем пустой массив, если заявок нет
        }
        throw error; // Пробрасываем другие ошибки дальше
    }
};

export const createApplication = async (applicationData) => {
    const response = await axiosInstance.post("/applications", applicationData);
    return response.data;
};

// Работа с тестами
export const getTests = async () => {
    const response = await axiosInstance.get("/tests");
    return response.data;
};

export const getTestById = async (id) => {
    const response = await axiosInstance.get(`/tests/${id}`);
    return response.data;
};

export const createTest = async (testData) => {
    const response = await axiosInstance.post("/tests", testData);
    return response.data;
};

export const submitTest = async (testId, answers) => {
    const response = await axiosInstance.post(`/tests/${testId}/submit`, { answers });
    return response.data;
};

export const deleteTestAPI = async (id) => {
    const response = await axiosInstance.delete(`/tests/${id}`);
    return response.data;
};

export const updateTest = async (id, testData) => {
    const response = await axiosInstance.put(`/tests/${id}`, testData);
    return response.data;
};

export const getQuestionsWithAnswers = async (testId) => {
    const response = await axiosInstance.get(`/tests/${testId}/questions-with-answers`);
    return response.data;
};

export const updateQuestionsAndAnswers = async (testId, questions) => {
    const response = await axiosInstance.put(`/tests/${testId}/questions`, { questions });
    return response.data;
};

export const generateTestAPI = async (topic) => {
    const response = await axiosInstance.post("/generate-test", { topic });
    return response.data;
};

// Работа с профилем
export const getProfile = async () => {
    const response = await axiosInstance.get('/auth/profile');
    const profileData = response.data;
    
    // Получаем информацию о сопроводительном письме
    try {
        const coverLetterResponse = await axiosInstance.get('/cover-letters');
        if (coverLetterResponse.data) {
            profileData.cover_letter = coverLetterResponse.data;
        }
    } catch (error) {
        if (error.response?.status === 404) {
            profileData.cover_letter = null;
        } else {
            console.error('Ошибка при получении сопроводительного письма:', error);
            profileData.cover_letter = null;
        }
    }
    
    return profileData;
};

export const updateProfile = async (profileData) => {
    const response = await axiosInstance.put("/auth/profile", profileData);
    return response.data;
};

export const createQuestion = async (testId, questionData) => {
    const response = await axiosInstance.post(`/tests/${testId}/questions`, questionData);
    return response.data;
};

export const createAnswer = async (questionId, answerData) => {
    const response = await axiosInstance.post(`/questions/${questionId}/answers`, answerData);
    return response.data;
};

export const deleteQuestion = async (id) => {
    const response = await axiosInstance.delete(`/questions/${id}`);
    return response.data;
};

export const deleteAnswer = async (id) => {
    const response = await axiosInstance.delete(`/answers/${id}`);
    return response.data;
};

// Работа с тегами
export const getTags = async () => {
    const response = await axiosInstance.get("/tags");
    return response.data;
};

// Работа с сопроводительными письмами
export const deleteCoverLetter = async (id) => {
    const response = await axiosInstance.delete(`/cover-letters/${id}`);
    return response.data;
};

export const downloadCoverLetterFile = async (id) => {
    const response = await axiosInstance.get(`/cover-letters/${id}/download`, {
        responseType: 'blob'
    });
    return response.data;
};

export const uploadCoverLetter = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/cover-letters/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};