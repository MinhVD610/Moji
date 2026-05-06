import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api',
    withCredentials: true,
});

// gắn accessToken vào req Header

api.interceptors.request.use((config) => {
    const {accessToken} = useAuthStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
}
);

// tự đong refresh token khi accessToken hết hạn
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url.includes("/auth/signin") || 
    originalRequest.url.includes("/auth/signup") ||
    originalRequest.url.includes("/auth/refresh")) {
        return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;
        // Handle authentication errors
        if(error.response?.status === 403 && originalRequest._retryCount < 4) {
            originalRequest._retryCount += 1;

            console.log("Attempting to refresh token... Retry count:", originalRequest._retryCount);
            try {
                const res = await api.post("/auth/refresh", {}, { withCredentials: true });
                const newAccessToken = res.data.accessToken;
                useAuthStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Handle refresh token error
                useAuthStore.getState().clearState();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    
});

export default api; 