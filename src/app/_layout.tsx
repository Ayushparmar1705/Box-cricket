import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#070E08' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
        <Stack.Screen name="bookings" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="Venuedetails" />
      </Stack>
    </>
  );
}

