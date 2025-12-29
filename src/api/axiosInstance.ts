import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, clearAuthToken } from '../store/authStore';
import { resetToLogin } from '../navigation/navigationRef';

// ✅ put this OUTSIDE interceptor (top-level in this file)
let didLogout = false;

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.11:5000/api',
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getAuthToken();

        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async error => {
        const status = error?.response?.status;

        // ✅ use it HERE
        if (status === 401 && !didLogout) {
            didLogout = true;

            await clearAuthToken();
            resetToLogin();

            setTimeout(() => {
                didLogout = false;
            }, 1000);
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
