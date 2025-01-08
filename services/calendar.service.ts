import { CalendarEvent, ExtendedCalendar } from '@/types/calendar';
import api from './axiosInstance';

// Create a new calendar
export const createCalendar = async (data: CalendarEvent): Promise<CalendarEvent> => {
    try {
        const response = await api.post('/calendar', data);
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error creating calendar:', error);
        throw error.response.data;
    }
};

// Get all calendars for the authenticated user
export const getAllCalendars = async (): Promise<ExtendedCalendar[]> => {
    try {
        const response = await api.get('/calendar');
        return response.data;
    } catch (error: any) {
        console.error('Error fetching calendars:', error);
        throw error.response.data;
    }
};

// Get a specific calendar by calendarId
export const getCalendarById = async (calendarId: string): Promise<ExtendedCalendar> => {
    try {
        const response = await api.get(`/calendar/single/${calendarId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching calendar:', error);
        throw error.response.data;
    }
};

// Update a calendar by calendarId
export const updateCalendar = async (calendarId: string, data: CalendarEvent): Promise<CalendarEvent> => {
    try {
        const response = await api.put(`/calendar/single/${calendarId}`, data);
        return response.data;
    } catch (error: any) {
        console.error('Error updating calendar:', error);
        throw error.response.data;
    }
};

// Delete a calendar by calendarId
export const deleteCalendar = async (calendarId: string): Promise<void> => {
    try {
        const response = await api.delete(`/calendar/single/${calendarId}`);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting calendar:', error);
        throw error.response.data;
    }
};
