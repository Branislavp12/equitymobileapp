// src/components/TradeForm.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import InputField from '../ui/InputField';
import PrimaryButton from '../ui/PrimaryButton';
import ErrorText from '../ui/ErrorText';
import { tokens } from '../theme/tokens';

export interface TradeFormProps {
  onSubmit: (args: { risk: number; reward: number }) => void;
  resetKey: number;
}

const TradeForm: React.FC<TradeFormProps> = ({ onSubmit, resetKey }) => {
  const [risk, setRisk] = useState<string>('');
  const [reward, setReward] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);

  useEffect(() => {
    setRisk('');
    setReward('');
    setError('');
    setTouched(false);
  }, [resetKey]);

  const validate = (): string => {
    const r = parseFloat(risk);
    const rw = parseFloat(reward);
    if (isNaN(r) || isNaN(rw)) return 'Zadaj obe hodnoty.';
    if (r <= 0 || rw <= 0) return 'Risk aj Reward musia byť väčšie než 0 %';
    if (r > 100) return 'Maximálny risk je 100 %';
    if (rw > 500) return 'Maximálny zisk je 500 %';
    return '';
  };

  const handleSubmit = () => {
    setTouched(true);
    const errorMsg = validate();
    setError(errorMsg);
    if (!errorMsg) {
      onSubmit({ risk: parseFloat(risk), reward: parseFloat(reward) });
    }
  };

  const errorMsg = validate();
  const showError = touched && errorMsg;
  const showRiskWarning = !errorMsg && parseFloat(risk) > 20;

  return (
    <View style={styles.container}>
      

      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          <InputField
            placeholder="Riskujem %"
            label=""
            value={risk}
            onChangeText={setRisk}
            keyboardType="numeric"
            error={showError ? errorMsg : undefined}
          />
        </View>
        <View style={styles.inputWrapper}>
          <InputField
            placeholder="Získam %"
            label=""
            value={reward}
            onChangeText={setReward}
            keyboardType="numeric"
            error={showError ? errorMsg : undefined}
          />
        </View>
      </View>

      <View style={styles.okWrapper}>
        <PrimaryButton onPress={handleSubmit} disabled={false}>
          OK
        </PrimaryButton>
      </View>

      {showError && <ErrorText message={errorMsg} />}

      {showRiskWarning && (
        <Text style={styles.warning}>
          POZOR: Riskuješ viac ako 20% kapitálu!
        </Text>
      )}
    </View>
  );
};

export default TradeForm;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: tokens.spacing.md,
  },
  heading: {
    fontFamily: tokens.font.family,
    fontWeight: tokens.font.weightBold,
    color: tokens.colors.textPrimary,
    fontSize: 16,
    marginBottom: tokens.spacing.sm,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  inputWrapper: {
    flex: 1,
  },
  okWrapper: {
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  warning: {
    marginTop: tokens.spacing.sm,
    textAlign: 'center',
    color: '#f9c846',
    fontWeight: 'bold',
    fontFamily: tokens.font.family,
  },
});
