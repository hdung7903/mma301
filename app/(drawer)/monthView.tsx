import { useEvents } from '@/contexts/EventContext';
import { Event } from '@/types/calendar';
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';


export default function MonthView({ navigation }: { navigation: any }) {
    const { events } = useEvents();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);


    const onDayPress = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
    };

    const renderEventItem = (event: Event) => (
        <View key={event.id} style={styles.eventItem}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text>
                {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    const markedDates = events.reduce((acc: Record<string, any>, event: Event) => {
        if (!acc[event.date]) {
            acc[event.date] = { marked: true };
        }
        return acc;
    }, {});

    markedDates[selectedDate] = { ...markedDates[selectedDate], selected: true, selectedColor: '#4285F4' };

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={onDayPress}
                markedDates={markedDates}
                theme={{
                    todayTextColor: '#4285F4',
                    arrowColor: '#4285F4',
                }}
            />
            <View style={styles.eventsContainer}>
                <Text style={styles.eventsTitle}>{`Events on ${selectedDate}`}</Text>
                <ScrollView>
                    {events.filter(event => event.date === selectedDate).map(renderEventItem)}
                </ScrollView>
            </View>
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
    eventsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
    eventTime: {
        fontSize: 14,
        color: '#666',
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#4285F4',
        borderRadius: 28,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});