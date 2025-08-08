// src/ui/GoalPlaceholderCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SectionCard from './SectionCard';
import GhostButton from './GhostButton';
import { tokens } from '../theme/tokens';

interface Props {
  onPress: () => void;
}

const GoalPlaceholderCard: React.FC<Props> = ({ onPress }) => (
  <SectionCard>
    <View style={styles.wrapper}>
      <Text style={styles.title}>🎯 Nemáš nastavený cieľ</Text>
      <Text style={styles.description}>
        Zadaj si cieľ obchodovania a sleduj denné tempo svojho progresu.
      </Text>
      <GhostButton text="Nastaviť cieľ" onPress={onPress} />
    </View>
  </SectionCard>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  title: {
    fontSize: 16,
    color: tokens.colors.textPrimary,
    fontFamily: tokens.font.family,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: tokens.colors.textMuted,
    fontFamily: tokens.font.family,
    textAlign: 'center',
  },
});

export default GoalPlaceholderCard;