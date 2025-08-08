import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

const HeaderText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.heading}>{children}</Text>
);

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
    color: tokens.colors.textPrimary,
    fontSize: 18,
    fontWeight: tokens.font.weightBold,
  },
});

export default HeaderText;
