import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Unified API services
export const courseAPI = {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    markLessonComplete: (courseId, moduleId, lessonId) =>
        api.put(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`),
    markCourseComplete: (courseId) => api.put(`/courses/${courseId}/complete`),
};

export const assignmentAPI = {
    getAll: () => api.get('/assignments'),
    submit: (id, submissionData) => api.post(`/assignments/${id}/submit`, { submissionData }),
};

export const quizAPI = {
    getAll: () => api.get('/quizzes'),
    submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
};

export const attendanceAPI = {
    getAll: () => api.get('/attendance'),
};

export const supportAPI = {
    getAll: () => api.get('/support'),
    create: (data) => api.post('/support', data),
};

export const analyticsAPI = {
    getOverview: () => api.get('/analytics'),
};

export default api;
