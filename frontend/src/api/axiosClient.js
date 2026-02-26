import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://navkalpana-ricr-nk-0041-backend.onrender.com/api',
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        // First try the dedicated token key, then fall back to user.token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user.token) {
                        config.headers.Authorization = `Bearer ${user.token}`;
                    }
                } catch (_) { /* ignore parse errors */ }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401s globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If we get a 401, the token is likely stale or invalid
            // clear state and reload to trigger auto-login or redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
        }
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
