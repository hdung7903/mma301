import { useEvents } from '@/contexts/EventContext';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Event } from '@/types/calendar';

const HOUR_HEIGHT = 60;
const TOTAL_HOURS = 24;

export default function DayView() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const scrollViewRef = useRef<ScrollView>(null);
    const { events, deleteEvent } = useEvents();


    useEffect(() => {
        if (scrollViewRef.current) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const scrollPosition = currentHour * HOUR_HEIGHT + (currentMinute / 60) * HOUR_HEIGHT;
            scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false });
        }
    }, []);

    const goToPreviousDay = () => {
        setSelectedDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() - 1);
            return newDate;
        });
    };

    const goToNextDay = () => {
        setSelectedDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + 1);
            return newDate;
        });
    };

    const renderTimeSlots = () => {
        const slots = [];
        for (let i = 0; i < TOTAL_HOURS; i++) {
            const time = `${i.toString().padStart(2, '0')}:00`;
            slots.push(
                <View key={i} style={styles.timeSlot}>
                    <Text style={styles.timeText}>{time}</Text>
                </View>
            );
        }
        return slots;
    };

    const renderEvents = () => {
        return events
            .filter(event => {
                const eventDate = new Date(event.date).toDateString();
                const selectedDateString = selectedDate.toDateString();
                if (eventDate === selectedDateString) {
                    console.log(event);
                }

                return eventDate === selectedDateString;
            })
            .map(event => {
                const startTime = new Date(event.startTime).toTimeString();
                const endTime = new Date(event.endTime).toTimeString()
                const startHour = parseInt(startTime.split(':')[0]);
                const startMinute = parseInt(startTime.split(':')[1]);
                const endHour = parseInt(endTime.split(':')[0]);
                const endMinute = parseInt(endTime.split(':')[1]);

                const top = startHour * HOUR_HEIGHT + (startMinute / 60) * HOUR_HEIGHT;
                const height = (endHour - startHour) * HOUR_HEIGHT + ((endMinute - startMinute) / 60) * HOUR_HEIGHT;

                return (
                    <View
                        key={event.id}
                        style={[
                            styles.event,
                            {
                                top,
                                height,
                            },
                        ]}
                    >
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventTime}>{`${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
                    </View>
                );
            });
    };

    const handleEventPress = (event:Event) => {
        Alert.alert(
            "Event Options",
            "Choose an action",
            [
                {
                    text: "Edit",
                    onPress: () => {
                        // Implement your edit logic here
                        // For example, open a modal to edit the event
                    }
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        await deleteEvent(event.id);
                        Alert.alert("Event deleted");
                    },
                    style: "destructive"
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goToPreviousDay} style={styles.dateButton}>
                    <Text style={styles.dateButtonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={goToNextDay} style={styles.dateButton}>
                    <Text style={styles.dateButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
            <ScrollView ref={scrollViewRef} style={styles.scrollView}>
                <View style={styles.content}>
                    <View style={styles.timeSlotsContainer}>{renderTimeSlots()}</View>
                    <View style={styles.eventsContainer}>
                        {renderEvents()}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#4285F4',
        borderRadius: 4,
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flexDirection: 'row',
    },
    timeSlotsContainer: {
        width: 60,
    },
    timeSlot: {
        height: HOUR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    timeText: {
        fontSize: 12,
        color: '#888',
    },
    eventsContainer: {
        flex: 1,
        position: 'relative',
    },
    event: {
        position: 'absolute',
        left: 4,
        right: 4,
        padding: 4,
        backgroundColor: '#4285F4',
        borderRadius: 4,
    },
    eventTitle: {
        color: '#fff',
        fontWeight: 'bold',
    },
    eventTime: {
        color: '#fff',
        fontSize: 12,
    },
});