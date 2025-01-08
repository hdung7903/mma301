import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { Event } from '@/types/calendar';
import { useEvents } from '@/contexts/EventContext';


export default function WeekView() {
    const { events, getEventsForWeek, setEvents } = useEvents();
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); 
    const [weekDates, setWeekDates] = useState<string[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const weekEvents = getEventsForWeek(new Date(selectedDate));
        setWeekDates(getWeekDates(selectedDate));
        console.log('Events for week:', weekEvents);
    }, [selectedDate]);

    const loadData = async () => {
        try {
            const savedDate = await AsyncStorage.getItem('selectedDate');
            const savedEvents = await AsyncStorage.getItem('events');
            if (savedDate) setSelectedDate(savedDate);
            if (savedEvents) setEvents(JSON.parse(savedEvents));
        } catch (error) {
            console.error("Failed to load data", error);
        }
    };

    const onDayPress = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
    };

    const getWeekDates = (date: string) => {
        const week: string[] = [];
        const current = new Date(date);
        current.setDate(current.getDate() - current.getDay());
        for (let i = 0; i < 7; i++) {
            week.push(new Date(current).toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
        }
        return week;
    };

    const renderEventItem = (event: Event) => (
        <View key={event.id} style={styles.eventItem}>
            <View style={[styles.eventDot, { backgroundColor: getEventColor(parseInt(event.id)) }]} />
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text>
                {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    const getEventColor = (id: number) => {
        const colors = ['#4285F4', '#0F9D58', '#F4B400', '#DB4437'];
        return colors[id % colors.length];
    };

    const markedDates = events.reduce((acc: Record<string, any>, event: Event) => {
        if (!acc[event.date]) {
            acc[event.date] = { marked: true, dotColor: getEventColor(parseInt(event.id)) };
        }
        return acc;
    }, {});

    weekDates.forEach(date => {
        markedDates[date] = { ...markedDates[date], selected: true, selectedColor: '#E8F0FE' };
    });

    return (
        <View style={styles.container}>
            <Calendar
                current={selectedDate}
                onDayPress={onDayPress}
                markedDates={markedDates}
                theme={{
                    todayTextColor: '#4285F4',
                    arrowColor: '#4285F4',
                    'stylesheet.calendar.header': {
                        week: {
                            marginTop: 5,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }
                    }
                }}
            />
            <ScrollView style={styles.eventsContainer}>
                {weekDates.map(date => (
                    <View key={date} style={styles.dayContainer}>
                        <Text style={styles.dateTitle}>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
                        {events
                            .filter(event => event.date === date)
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map(renderEventItem)}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    eventsContainer: {
        flex: 1,
        padding: 20,
    },
    dayContainer: {
        marginBottom: 20,
    },
    dateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4285F4',
    },
    eventItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    eventDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
});