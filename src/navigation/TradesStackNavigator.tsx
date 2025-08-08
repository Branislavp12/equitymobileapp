// src/navigation/TradesStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importni TradesScreen (zatiaľ placeholder)
import TradesScreen from '../screens/TradesScreen';

const Stack = createNativeStackNavigator();

// Stack pre sekciu Trades (zoznam obchodov)
const TradesStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TradesScreen" component={TradesScreen} />
      {/* Neskôr: <Stack.Screen name="TradeDetailScreen" component={TradeDetailScreen} /> */}
    </Stack.Navigator>
  );
};

export default TradesStackNavigator;
