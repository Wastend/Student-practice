import axios from "axios";

// Базовая конфигурация axios
axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Добавляем токен к запросам, если он есть
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Авторизация
export const login = async (email, password) => {
    const response = await axios.post("/auth/login", { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post("/auth/register", userData);
    return response.data;
};

// Работа с вакансиями
export const getJobs = async (filters = {}) => {
    const response = await axios.get("/jobs", { params: filters });
    console.log(response);
    
    return response.data;
};

export const getJobById = async (id) => {
    const response = await axios.get(`/jobs/${id}`);
    return response.data;
};

export const createJob = async (jobData) => {
    const response = await axios.post("/jobs", jobData);
    return response.data;
};

export const updateJob = async (id, jobData) => {
    const response = await axios.put(`/jobs/${id}`, jobData);
    return response.data;
};

export const deleteJob = async (id) => {    
    const response = await axios.delete(`/jobs/${id}`);
    return response.data;
};

// Работа с заявками
export const getApplications = async (filters = {}) => {
    const response = await axios.get("/applications", { params: filters });
    return response.data;
};

export const createApplication = async (applicationData) => {
    const response = await axios.post("/applications", applicationData);
    return response.data;
};

// Работа с тестами
export const getTests = async () => {
    const response = await axios.get("/tests");
    return response.data;
};

export const getTestById = async (id) => {
    const response = await axios.get(`/tests/${id}`);
    return response.data;
};

export const createTest = async (testData) => {
    const response = await axios.post("/tests", testData);
    return response.data;
};

export const submitTest = async (testId, answers) => {
    const response = await axios.post(`/tests/${testId}/submit`, { answers });
    return response.data;
};

export const deleteTestAPI = async (id) => {
    const response = await axios.delete(`/tests/${id}`);
    return response.data;
};

export const updateTest = async (id, testData) => {
    const response = await axios.put(`/tests/${id}`, testData);
    return response.data;
};

export const getQuestionsWithAnswers = async (testId) => {
    const response = await axios.get(`/tests/${testId}/questions-with-answers`);
    return response.data;
};

export const updateQuestionsAndAnswers = async (testId, questions) => {
    const response = await axios.put(`/tests/${testId}/questions`, { questions });
    return response.data;
};

export const generateTestAPI = async (topic) => {
    const response = await axios.post("/generate-test", { topic });
    return response.data;
};

// Работа с профилем
export const getProfile = async () => {
    const response = await axios.get('/auth/profile');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await axios.put("/auth/profile", profileData);
    return response.data;
};

export const createQuestion = async (testId, questionData) => {
    const response = await axios.post(`/tests/${testId}/questions`, questionData);
    return response.data;
};

export const createAnswer = async (questionId, answerData) => {
    const response = await axios.post(`/questions/${questionId}/answers`, answerData);
    return response.data;
};

export const deleteQuestion = async (id) => {
    const response = await axios.delete(`/questions/${id}`);
    return response.data;
};

export const deleteAnswer = async (id) => {
    const response = await axios.delete(`/answers/${id}`);
    return response.data;
};

// Работа с тегами
export const getTags = async () => {
    const response = await axios.get("/tags");
    return response.data;
};

export const createTag = async (tagData) => {
    const response = await axios.post("/tags", tagData);
    return response.data;
};

export const updateTag = async (id, tagData) => {
    const response = await axios.put(`/tags/${id}`, tagData);
    return response.data;
};

export const deleteTag = async (id) => {
    const response = await axios.delete(`/tags/${id}`);
    return response.data;
};

// Метод для загрузки сопроводительного письма
export const uploadCoverLetter = async (formData, xhr = null) => {
  if (xhr) {
    return new Promise((resolve, reject) => {
      xhr.open('POST', '/api/cover-letters');
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error(xhr.response));
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('Network error'));
      };
      
      xhr.send(formData);
    });
  } else {
    const response = await axios.post('/api/cover-letters', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }
};

export const downloadCoverLetterFile = async (id) => {
  const response = await axios.get(`/cover-letters/${id}/download`, {
    responseType: 'blob'
  });
  return response.data;
};

export const deleteCoverLetter = async (id) => {
  const response = await axios.delete(`/cover-letters/${id}`);
  return response.data;
};

// Метод для отклика на вакансию
export const applyToVacancy = async (data) => {
  const response = await axios.post('/applications', data);
  return response.data;
};