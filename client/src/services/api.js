import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5005/api',
    withCredentials: true,
});

// Request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            const { token } = JSON.parse(user);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
