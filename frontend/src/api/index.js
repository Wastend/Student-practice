import axios from "axios";

// Авторизация
export const login = async (email, password) => {
    const response = await axios.post("/login", { email, password });
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post("/register", userData);
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
    const response = await axios.get('/profile');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await axios.put("/profile", profileData);
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