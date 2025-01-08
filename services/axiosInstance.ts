import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance
const api = axios.create({
    baseURL: "http://192.168.0.2:8000",
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Authorization header (JWT Token)
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token'); // Retrieve the token from AsyncStorage
        if (token) {
            config.headers['Authorization'] = `Bearrer ${token}`; // Add token to headers
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
