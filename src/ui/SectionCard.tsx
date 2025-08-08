// SectionCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '../theme/tokens';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

const SectionCard: React.FC<Props> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    width: '100%',
  },
});

export default SectionCard;
