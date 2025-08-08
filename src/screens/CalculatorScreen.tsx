// src/screens/CalculatorScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CalculatorScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CalculatorScreen – trading kalkulačka (pripravujeme)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#191c1f',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CalculatorScreen;
