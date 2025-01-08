import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCalendar } from '@/contexts/CalendarContex';
import { useEvent } from '@/contexts/EventContext';

interface AddItemModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAddEvent: (event: any) => void;
    onAddCalendar: (calendar: any) => void;
}

export default function AddItemModal({ isVisible, onClose, onAddEvent, onAddCalendar }: AddItemModalProps) {
    const [selectedType, setSelectedType] = useState<'Event' | 'Calendar' | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventStartTime, setEventStartTime] = useState(new Date());
    const [eventEndTime, setEventEndTime] = useState(new Date());
    const [eventDate, setEventDate] = useState(new Date());
    const [eventLocation, setEventLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [calendarName, setCalendarName] = useState('');

    const { addCalendar } = useCalendar();
    const { addEvent } = useEvent();

    const handleAddEvent = async () => {
        if (!eventTitle || !eventDate) {
            Alert.alert('Error', 'Title and Date are required.');
            return;
        }

        if (eventStartTime.toISOString() >= eventEndTime.toISOString()) {
            Alert.alert("Error", "Start Time must be smaller than End Time");
            return;
        }

        const newEvent = {
            id: Date.now().toString(),
            title: eventTitle,
            startTime: eventStartTime.toISOString(),
            endTime: eventEndTime.toISOString(),
            date: eventDate.toISOString(),
            location: eventLocation,
            description: eventDescription,
        };

        try {
            setLoading(true);
            await addEvent(newEvent);
            resetForm();
            Alert.alert('Success', 'Event created successfully');
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCalendar = async () => {
        if (!calendarName) {
            Alert.alert('Error', 'Calendar name is required.');
            return;
        }

        const newCalendar = {
            id: Date.now().toString(),
            name: calendarName,
            isChecked: true,
        };

        try {
            setLoading(true);
            await addCalendar(newCalendar);
            resetForm();
            Alert.alert('Success', 'Calendar saved successfully');
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create calendar');
        } finally {
            setLoading(false);
        }
    };


    const resetForm = () => {
        setEventTitle('');
        setEventStartTime(new Date());
        setEventEndTime(new Date());
        setEventDate(new Date());
        setEventLocation('');
        setEventDescription('');
        setCalendarName('');
        setSelectedType(null);
    };

    const getEventsForDay = async (date: Date) => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const allEvents = JSON.parse(await AsyncStorage.getItem('events') || '[]');
            return allEvents.filter((event: any) => event.date === formattedDate);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to retrieve events');
            return [];
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsForToday = await getEventsForDay(new Date());
            console.log('Events for today:', eventsForToday);
        };
        fetchEvents();
    }, []);

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        <Text style={styles.modalTitle}>Add New Item</Text>

                        <View style={styles.typeSelection}>
                            <TouchableOpacity
                                style={[styles.typeButton, selectedType === 'Event' && styles.selectedTypeButton]}
                                onPress={() => setSelectedType('Event')}
                            >
                                <Ionicons name="calendar-outline" size={24} color={selectedType === 'Event' ? '#FFFFFF' : '#000000'} />
                                <Text style={[styles.typeButtonText, selectedType === 'Event' && styles.selectedTypeButtonText]}>Event</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.typeButton, selectedType === 'Calendar' && styles.selectedTypeButton]}
                                onPress={() => setSelectedType('Calendar')}
                            >
                                <Ionicons name="notifications-outline" size={24} color={selectedType === 'Calendar' ? '#FFFFFF' : '#000000'} />
                                <Text style={[styles.typeButtonText, selectedType === 'Calendar' && styles.selectedTypeButtonText]}>Calendar</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedType === 'Event' && (
                            <View>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="pencil-outline" size={24} color="#4285F4" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Event Title (required)"
                                        value={eventTitle}
                                        onChangeText={setEventTitle}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Ionicons name="calendar-outline" size={24} color="#4285F4" style={styles.inputIcon} />
                                    <Text style={styles.dateButtonText}>{eventDate.toDateString()}</Text>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={eventDate}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) setEventDate(selectedDate);
                                        }}
                                    />
                                )}

                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setShowStartTimePicker(true)}
                                >
                                    <Ionicons name="time-outline" size={24} color="#4285F4" style={styles.inputIcon} />
                                    <Text style={styles.dateButtonText}>{`Start: ${eventStartTime.toLocaleTimeString()}`}</Text>
                                </TouchableOpacity>

                                {showStartTimePicker && (
                                    <DateTimePicker
                                        value={eventStartTime}
                                        mode="time"
                                        display="default"
                                        onChange={(event, selectedTime) => {
                                            setShowStartTimePicker(false);
                                            if (selectedTime) setEventStartTime(selectedTime);
                                        }}
                                    />
                                )}

                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setShowEndTimePicker(true)}
                                >
                                    <Ionicons name="time-outline" size={24} color="#4285F4" style={styles.inputIcon} />
                                    <Text style={styles.dateButtonText}>{`End: ${eventEndTime.toLocaleTimeString()}`}</Text>
                                </TouchableOpacity>

                                {showEndTimePicker && (
                                    <DateTimePicker
                                        value={eventEndTime}
                                        mode="time"
                                        display="default"
                                        onChange={(event, selectedTime) => {
                                            setShowEndTimePicker(false);
                                            if (selectedTime) setEventEndTime(selectedTime);
                                        }}
                                    />
                                )}

                                <View style={styles.inputContainer}>
                                    <Ionicons name="location-outline" size={24} color="#4285F4" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Location (optional)"
                                        value={eventLocation}
                                        onChangeText={setEventLocation}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Ionicons name="document-text-outline" size={24} color="#4285F4" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Description (optional)"
                                        value={eventDescription}
                                        onChangeText={setEventDescription}
                                        multiline
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={handleAddEvent}
                                    disabled={loading}
                                >
                                    <Text style={styles.addButtonText}>
                                        {loading ? 'Adding...' : 'Add Event'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {selectedType === 'Calendar' && (
                            <View>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="pencil-outline" size={24} color="#4285F4" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Calendar Name (required)"
                                        value={calendarName}
                                        onChangeText={setCalendarName}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={handleAddCalendar}
                                    disabled={loading}
                                >
                                    <Text style={styles.addButtonText}>
                                        {loading ? 'Adding...' : 'Add Calendar'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close-circle-outline" size={32} color="#4285F4" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        elevation: 10,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#4285F4',
    },
    typeSelection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    selectedTypeButton: {
        backgroundColor: '#4285F4',
    },
    typeButtonText: {
        color: '#000',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    selectedTypeButtonText: {
        color: '#FFFFFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#4285F4',
        marginBottom: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#4285F4',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#4285F4',
        borderRadius: 10,
        marginBottom: 15,
    },
    picker: {
        height: 50,
    },
    addButton: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});