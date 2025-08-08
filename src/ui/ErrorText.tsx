import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

const ErrorText: React.FC<{ message: string }> = ({ message }) => {
  if (!message) return null;
  return <Text style={styles.error}>{message}</Text>;
};

const styles = StyleSheet.create({
  error: {
    color: tokens.colors.accentRed,
    textAlign: 'center',
    marginTop: 8,
    minHeight: 20,
  },
});

export default ErrorText;
