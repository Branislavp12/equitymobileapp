import React from 'react';
import { View, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.container}>
    <View style={[styles.bar, { width: `${Math.min(progress * 100, 100)}%` }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 8,
    borderRadius: tokens.radius.sm,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: tokens.colors.accentBlue,
  },
});

export default ProgressBar;
