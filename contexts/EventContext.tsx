import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalendarEvent, Event } from '@/types/calendar';

type EventContextType = {
    events: Event[];
    addEvent: (event: CalendarEvent) => Promise<void>;
    updateEvent: (id: string, updatedEvent: Event) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    getEventsForDay: (date: Date) => Event[];
    getEventsForWeek: (startDate: Date) => Event[];
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const storedEvents = await AsyncStorage.getItem('events');
            console.log(storedEvents);
            
            if (storedEvents) {
                setEvents(JSON.parse(storedEvents));
            }
        } catch (error) {
            console.error('Failed to load events', error);
        }
    };

    const saveEvents = async (newEvents: Event[]) => {
        try {
            await AsyncStorage.setItem('events', JSON.stringify(newEvents));
            setEvents(newEvents);
        } catch (error) {
            console.error('Failed to save events', error);
        }
    };

    const addEvent = async (event: CalendarEvent) => {
        const newEvent: Event = {
            ...event,
            id: Date.now().toString(),
            date: new Date(event.date).toISOString().split('T')[0], 
        };
        const newEvents = [...events, newEvent];
        await saveEvents(newEvents);
    };

    const updateEvent = async (id: string, updatedEvent: Event) => {
        const newEvents = events.map(event =>
            event.id === id ? updatedEvent : event
        );
        await saveEvents(newEvents);
    };

    const deleteEvent = async (id: string) => {
        const newEvents = events.filter(event => event.id !== id);
        await saveEvents(newEvents);
    };

    const getEventsForDay = (date: Date) => {
        const formattedDate = date.toISOString().split('T')[0];
        const result = events.filter(event => event.date === formattedDate);
        return result;
    };

    const getEventsForWeek = (startDate: Date) => {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);

        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= startDate && eventDate < endDate;
        });
    };

    const value = {
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventsForDay,
        getEventsForWeek,
        setEvents,
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};

export const useEvent = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvent must be used within an EventProvider');
    }
    return context;
};