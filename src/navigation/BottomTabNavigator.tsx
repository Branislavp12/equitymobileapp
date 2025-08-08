// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import stack navigátorov pre jednotlivé sekcie
import TradingStackNavigator from './TradingStackNavigator';
import TradesStackNavigator from './TradesStackNavigator';
import CalendarStackNavigator from './CalendarStackNavigator';  
import CalculatorStackNavigator from './CalculatorStackNavigator';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  TradingTab: 'bar-chart',
  TradesTab: 'list',
  CalendarTab: 'calendar',
  CalculatorTab: 'calculator',
};

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName = iconMap[route.name] || 'help-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="TradingTab"
        component={TradingStackNavigator}
        options={{ tabBarLabel: 'Trading' }}
      />
      <Tab.Screen
        name="TradesTab"
        component={TradesStackNavigator}
        options={{ tabBarLabel: 'Obchody' }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarStackNavigator}
        options={{ tabBarLabel: 'Kalendár' }}
      />
      <Tab.Screen
        name="CalculatorTab"
        component={CalculatorStackNavigator}
        options={{ tabBarLabel: 'Kalkulačka' }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
