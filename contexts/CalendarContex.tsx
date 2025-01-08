import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from '@/types/calendar';
import { CalendarContextProviderProps } from 'react-native-calendars';

interface CalendarContextType {
    calendars: Calendar[];
    addCalendar: (calendar: Calendar) => Promise<void>;
    updateCalendar: (id: string, updatedCalendar: Calendar) => Promise<void>;
    deleteCalendar: (id: string) => Promise<void>;
    setCalendars: React.Dispatch<React.SetStateAction<Calendar[]>>;
}

interface CustomCalendarProviderProps {
    children: React.ReactNode;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CustomCalendarProvider: React.FC<CustomCalendarProviderProps> = ({ children }) => {
    const [calendars, setCalendars] = useState<Calendar[]>([]);

    useEffect(() => {
        const loadCalendars = async () => {
            try {
                const storedCalendars = await AsyncStorage.getItem('calendars');
                if (storedCalendars) {
                    setCalendars(JSON.parse(storedCalendars));
                }
            } catch (error) {
                console.error('Failed to load calendars', error);
            }
        };

        loadCalendars();
    }, []);

    const saveCalendars = async (newCalendars: Calendar[]) => {
        try {
            await AsyncStorage.setItem('calendars', JSON.stringify(newCalendars));
        } catch (error) {
            console.error('Failed to save calendars', error);
        }
    };

    const addCalendar = async (calendar: Calendar) => {
        const newCalendars = [...calendars, calendar];
        setCalendars(newCalendars);
        await saveCalendars(newCalendars);
    };

    const updateCalendar = async (id: string, updatedCalendar: Calendar) => {
        const newCalendars = calendars.map(calendar =>
            calendar.id === id ? updatedCalendar : calendar
        );
        setCalendars(newCalendars);
        await saveCalendars(newCalendars);
    };

    const deleteCalendar = async (id: string) => {
        const newCalendars = calendars.filter(calendar => calendar.id !== id);
        setCalendars(newCalendars);
        await saveCalendars(newCalendars);
    };

    return (
        <CalendarContext.Provider
            value={{ calendars, addCalendar, updateCalendar, deleteCalendar, setCalendars }}
        >
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendar must be used within a CustomCalendarProvider');
    }
    return context;
};