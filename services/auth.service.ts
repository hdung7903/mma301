import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './axiosInstance';
import { AxiosError } from 'axios';
import { LoginForm, RegisterForm } from '@/types/form';

// Register a new user
export const register = async (data: RegisterForm) => {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error registering user:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error registering user:', error);
            throw new Error('Unexpected error');
        }
    }
};

// Login user
export const login = async (data: LoginForm) => {
    try {
        const response = await api.post('/auth/login', data);
        await AsyncStorage.setItem('token', response.data.token); // Store the token using AsyncStorage
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error logging in:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error logging in:', error);
            throw new Error('Unexpected error');
        }
    }
};

// Forgot Password
export const checkAccount = async (data: { email: string }) => {
    try {
        const response = await api.post('/auth/check-account', data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error sending OTP for password reset:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error sending OTP:', error);
            throw new Error('Unexpected error');
        }
    }
};

// Reset Password
export const resetPassword = async (data: { email: string; otp: string; newPassword: string }): Promise<any> => {
    try {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error resetting password:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error resetting password:', error);
            throw new Error('Unexpected error');
        }
    }
};

// Logout (optional)
export const logout = async () => {
    await AsyncStorage.removeItem('token'); // Remove the JWT token from AsyncStorage
};
