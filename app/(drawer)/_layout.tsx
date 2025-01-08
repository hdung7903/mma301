import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Checkbox from 'expo-checkbox';

import DayView from './dayView';
import WeekView from './weekView';
import MonthView from './monthView';
import AddItemModal from "../../components/AddItemModal";
import { Calendar, CalendarEvent, ExtendedCalendar } from '@/types/calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCalendar } from '@/contexts/CalendarContex';


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  // const [calendars, setCalendars] = useState<ExtendedCalendar[]>([]);

  const { calendars, setCalendars } = useCalendar(); 

    useEffect(() => {
      const fetchCalendars = async () => {
        try {
          const calendarsData = await AsyncStorage.getItem('calendars');
          if (calendarsData) {
            const parsedCalendars = JSON.parse(calendarsData).map((calendar:Calendar) => ({
              ...calendar,
              isChecked: true,
            }));
            setCalendars(parsedCalendars);
          } else {
            console.log('No calendars data found in AsyncStorage.');
            setCalendars([]);
          }
        } catch (error:any) {
          Alert.alert('Error', error.message || 'Failed to retrieve calendars');
        }
      };
    
      fetchCalendars();
    }, []);

    const toggleCalendar = (id: string) => {
      const updatedCalendars = calendars.map(cal =>
        cal.id === id ? { ...cal, isChecked: !cal.isChecked } : cal
      );
      setCalendars(updatedCalendars);
      AsyncStorage.setItem('calendars', JSON.stringify(updatedCalendars)); // Persist changes
    };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Calendars</Text>
      {calendars.map(calendar => (
        <View key={calendar.id} style={styles.calendarItem}>
          <Checkbox
            value={calendar.isChecked}
            onValueChange={() => toggleCalendar(calendar.id)}
          />
          <Text style={styles.calendarName}>{calendar.name}</Text>
        </View>
      ))}

    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents(prevEvents => [...prevEvents, event]);
    console.log('New Event:', event);
    hideModal();
  };

  const handleAddCalendar = (calendar: Calendar) => {
    setCalendars(prevCalendars => [...prevCalendars, calendar]);
    console.log('New Calendar:', calendar);
    hideModal();
  };

  return (
    <>
      <Drawer.Navigator
        initialRouteName="Day"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4285F4',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerActiveTintColor: '#4285F4',
          drawerInactiveTintColor: '#333',
          unmountOnBlur: true,
        }}
      >
        <Drawer.Screen
          name="Day"
          component={DayView}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="today-outline" size={size} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity onPress={showModal} style={{ marginRight: 15 }}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
        <Drawer.Screen
          name="Week"
          component={WeekView}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity onPress={showModal} style={{ marginRight: 15 }}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
        <Drawer.Screen
          name="Month"
          component={MonthView}
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity onPress={showModal} style={{ marginRight: 15 }}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
      </Drawer.Navigator>
      <AddItemModal
        isVisible={isModalVisible}
        onClose={hideModal}
        onAddEvent={handleAddEvent}
        onAddCalendar={handleAddCalendar}
      />
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  calendarName: {
    marginLeft: 10,
    fontSize: 14,
  },
});
