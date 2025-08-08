// src/navigation/TradingStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importni si TradingScreen (zatiaľ placeholder, neskôr produkčný)
import TradingScreen from '../screens/TradingScreen';

const Stack = createNativeStackNavigator();

// Stack pre sekciu Trading
const TradingStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TradingScreen" component={TradingScreen} />
      {/* Neskôr: <Stack.Screen name="TradeDetailScreen" component={TradeDetailScreen} /> */}
    </Stack.Navigator>
  );
};

export default TradingStackNavigator;
