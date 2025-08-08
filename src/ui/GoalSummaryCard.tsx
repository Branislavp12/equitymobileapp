// src/ui/GoalSummaryCard.tsx

import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import SectionCard from './SectionCard';
import GhostButton from './GhostButton';
import ProgressBar from './ProgressBar';
import { tokens } from '../theme/tokens';

interface Props {
  goalAmount: number;
  targetDate: string;
  daysLeft: number;
  dailyTarget: number;
  progressPercent: number; // 0–1
  onEdit: () => void;
  onReset: () => void;
}

const GoalSummaryCard: React.FC<Props> = ({
  goalAmount,
  targetDate,
  daysLeft,
  dailyTarget,
  progressPercent,
  onEdit,
  onReset
}) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.wrapper, { maxWidth: width - 32 }]}>
      <SectionCard>
        <View style={styles.metricRow}>
          <Text style={styles.icon}>🎯</Text>
          <Text style={styles.label}>Cieľ:</Text>
          <View style={styles.spacer} />
          <Text style={styles.value}>{goalAmount} €</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.label}>do:</Text>
          <View style={styles.spacer} />
          <Text style={styles.value}>{targetDate}</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.icon}>⏳</Text>
          <Text style={styles.label}>Zostáva:</Text>
          <View style={styles.spacer} />
          <Text style={styles.value}>{daysLeft} dní</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.icon}>📈</Text>
          <Text style={styles.label}>Denný cieľ:</Text>
          <View style={styles.spacer} />
          <Text style={styles.value}>{dailyTarget.toFixed(2)}%</Text>
        </View>

        <View style={styles.progressWrapper}>
          <ProgressBar progress={progressPercent} />
        </View>

        <View style={styles.buttonsRow}>
          <GhostButton text="Zmeniť cieľ" onPress={onEdit} />
          <GhostButton text="Vymazať cieľ" onPress={onReset} />
        </View>
      </SectionCard>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: tokens.spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.xs,
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
  label: {
    fontSize: 14,
    color: tokens.colors.textMuted,
    fontFamily: tokens.font.family,
  },
  spacer: {
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: tokens.colors.textPrimary,
    fontFamily: tokens.font.family,
  },
  progressWrapper: {
    marginTop: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});

export default GoalSummaryCard;
