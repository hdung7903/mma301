import { CalendarEvent } from '@/types/calendar';
import api from './axiosInstance';
import { AxiosError } from 'axios';

// Create a new event
export const createEvent = async (data: CalendarEvent) => {
    try {
        const response = await api.post('/event', data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error creating event:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error creating event:', error);
            throw new Error('Unexpected error');
        }
    }
};

// Get all events for a specific calendar
export const getEventsByCalendar = async (calendarId: string) => {
    try {
        const response = await api.get(`/event/calendar/${calendarId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error fetching events:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error fetching events:', error);
            throw new Error('Unexpected error');
        }
    }
};

// Get a specific event by eventId
export const getEventById = async (eventId: string) => {
    try {
        const response = await api.get(`/event/single/${eventId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error fetching event:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error fetching event:', error);
            throw new Error('Unexpected error');
        }
    }
};

// Update an event by eventId
export const updateEvent = async (eventId: string, data: Event) => {
    try {
        const response = await api.put(`/event/single/${eventId}`, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error updating event:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error updating event:', error);
            throw new Error('Unexpected error');
        }
    }
};

// Delete an event by eventId
export const deleteEvent = async (eventId: string) => {
    try {
        const response = await api.delete(`/event/single/${eventId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error deleting event:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error deleting event:', error);
            throw new Error('Unexpected error');
        }
    }
};

// Get all events (optional, for debugging or admin)
export const getAllEvents = async () => {
    try {
        const response = await api.get('/event/all');
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.error('Error fetching all events:', error.response.data);
            throw error.response.data;
        } else {
            console.error('Unexpected error fetching all events:', error);
            throw new Error('Unexpected error');
        }
    }
};
