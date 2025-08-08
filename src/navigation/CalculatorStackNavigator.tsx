// src/navigation/CalculatorStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importni CalculatorScreen (placeholder)
import CalculatorScreen from '../screens/CalculatorScreen';

const Stack = createNativeStackNavigator();

// Stack pre sekciu Kalkulačka
const CalculatorStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalculatorScreen" component={CalculatorScreen} />
      {/* Neskôr: <Stack.Screen name="SomeOtherCalcScreen" component={SomeOtherCalcScreen} /> */}
    </Stack.Navigator>
  );
};

export default CalculatorStackNavigator;
