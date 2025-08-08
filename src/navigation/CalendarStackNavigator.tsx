// src/navigation/CalendarStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importni CalendarScreen (placeholder)
import CalendarScreen from '../screens/CalendarScreen';

const Stack = createNativeStackNavigator();

// Stack pre sekciu Kalendár
const CalendarStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      {/* Neskôr: <Stack.Screen name="DayDetailScreen" component={DayDetailScreen} /> */}
    </Stack.Navigator>
  );
};

export default CalendarStackNavigator;
