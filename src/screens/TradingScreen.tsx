// src/screens/TradingScreen.tsx

import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Alert } from 'react-native';
import EquityChart from '../components/EquityChart';
import TradeForm from '../components/TradeForm';
import SectionCard from '../ui/SectionCard';
import HeaderText from '../ui/HeaderText';
import GhostButton from '../ui/GhostButton';
import { removeCapital, removeTrades } from '../storage/persist';
import useTradeHistory, { TradeResult } from '../hooks/useTradeHistory';
import { tokens } from '../theme/tokens';

const TradingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tradeSetup, setTradeSetup] = useState<{ risk: number | null; reward: number | null }>({
    risk: null,
    reward: null,
  });
  const [resetKey, setResetKey] = useState<number>(0);

  const {
    trades,
    equityCurve,
    addTrade,
    undoLastTrade,
    resetHistory,
    initialCapital: capital,
    stats,
  } = useTradeHistory();

  const handleTradeSubmit = ({ risk, reward }: { risk: number; reward: number }) => {
    setTradeSetup({ risk, reward });
  };

  const handleBranchPress = (type: TradeResult) => {
    if (tradeSetup.risk != null && tradeSetup.reward != null) {
      addTrade({ risk: tradeSetup.risk, reward: tradeSetup.reward, result: type });
      setResetKey(prev => prev + 1);
      setTradeSetup({ risk: null, reward: null });
    }
  };

  const handleFullReset = () => {
    Alert.alert(
      'Resetovať účet',
      'Naozaj chceš vymazať celý účet a začať odznova? Prídeš o všetky dáta!',
      [
        { text: 'Zrušiť', style: 'cancel' },
        {
          text: 'Resetovať',
          style: 'destructive',
          onPress: async () => {
            await removeCapital();
            await removeTrades();
            navigation.replace('Welcome');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: tokens.colors.background }}
      contentContainerStyle={styles.container}
    >
      <SectionCard>
        <HeaderText>Trading workflow</HeaderText>
        <Text style={styles.equity}>
          Aktuálna equity: {equityCurve[equityCurve.length - 1]} €
        </Text>
      </SectionCard>

      <View style={styles.spacer} />

      <SectionCard>
        <EquityChart
          history={equityCurve}
          initialCapital={capital}
          risk={tradeSetup.risk ?? undefined}
          reward={tradeSetup.reward ?? undefined}
          onBranchPress={handleBranchPress}
        />
      </SectionCard>

      <View style={styles.spacer} />

      <SectionCard>

        <TradeForm onSubmit={handleTradeSubmit} resetKey={resetKey} />
        {tradeSetup.risk !== null && (
          <Text style={styles.riskReward}>
            Risk: {tradeSetup.risk}% | Reward: {tradeSetup.reward}%
          </Text>
        )}
      </SectionCard>

      <View style={styles.spacer} />

      <SectionCard>
        <HeaderText>Riadenie účtu</HeaderText>
        <View style={styles.divider} />
        <View style={styles.buttonRow}>
          <GhostButton text="SPÄŤ" onPress={() => navigation.goBack()} />
          <GhostButton
            text="Resetovať históriu"
            onPress={resetHistory}
            disabled={trades.length === 0}
          />
          <GhostButton
            text="Resetovať účet"
            onPress={handleFullReset}
          />
          <GhostButton
            text="Undo posledný obchod"
            onPress={undoLastTrade}
            disabled={trades.length === 0}
          />
        </View>
      </SectionCard>

      <View style={styles.spacer} />

      <SectionCard>
        <HeaderText>Štatistiky</HeaderText>
        <View style={styles.divider} />
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>Obchodov: {stats.tradesCount}</Text>
          <Text style={styles.statsText}>Winrate: {stats.winrate}%</Text>
          <Text style={styles.statsText}>
            Ziskových: {stats.winCount} | Stratových: {stats.lossCount}
          </Text>
        </View>
      </SectionCard>
    </ScrollView>
  );
};

export default TradingScreen;

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    flexGrow: 1,
  },
  spacer: {
    height: tokens.spacing.lg,
  },
  equity: {
    textAlign: 'center',
    color: tokens.colors.textMuted,
    fontFamily: tokens.font.family,
    fontSize: 14,
    marginTop: tokens.spacing.sm,
  },
  riskReward: {
    textAlign: 'center',
    marginTop: tokens.spacing.sm,
    fontFamily: tokens.font.family,
    color: tokens.colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.surface,
    marginVertical: tokens.spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: tokens.spacing.sm,
  },
  statsRow: {
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  statsText: {
    fontSize: 13,
    fontFamily: tokens.font.family,
    color: tokens.colors.textPrimary,
  },
});
