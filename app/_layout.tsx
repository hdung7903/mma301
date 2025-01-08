import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CalendarProvider } from 'react-native-calendars';
import { EventProvider } from '@/contexts/EventContext';
import { CustomCalendarProvider } from '@/contexts/CalendarContex';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CustomCalendarProvider>
        <CalendarProvider date={new Date().toISOString().split('T')[0]}>
          <EventProvider>
            <Stack>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </EventProvider>
        </CalendarProvider>
      </CustomCalendarProvider>
    </ThemeProvider>
  );
}