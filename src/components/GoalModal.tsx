// src/components/GoalModal.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import ModalContainer from '../ui/ModalContainer';
import SectionCard from '../ui/SectionCard';
import HeaderText from '../ui/HeaderText';
import InputField from '../ui/InputField';
import DateField from '../ui/DateField';
import GhostButton from '../ui/GhostButton';
import ErrorText from '../ui/ErrorText';
import { validateGoalInput } from '../utils/calendarMath';
import { tokens } from '../theme/tokens';

interface GoalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (amount: number, date: string) => Promise<void>;
  currentEquity: number;
  defaultAmount?: number;
  defaultDate?: string;
}

const GoalModal: React.FC<GoalModalProps> = ({
  visible,
  onClose,
  onSave,
  currentEquity,
  defaultAmount = undefined,
  defaultDate = undefined,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (visible) {
      setAmount(defaultAmount !== undefined ? String(defaultAmount) : '');
      setDate(defaultDate ? new Date(defaultDate) : null);
      setError('');
    }
  }, [visible, defaultAmount, defaultDate]);

  const handleSave = async () => {
    const errorMsg = validateGoalInput(
      parseFloat(amount),
      date ? date.toISOString().slice(0, 10) : '',
      currentEquity,
      today
    );
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setSubmitting(true);
    try {
      await onSave(parseFloat(amount), date!.toISOString().slice(0, 10));
      setSubmitting(false);
      setAmount('');
      setDate(null);
      setError('');
      onClose();
    } catch (e) {
      setSubmitting(false);
      setError('Chyba pri ukladaní cieľa.');
    }
  };

  return (
    <ModalContainer visible={visible} onBackdropPress={onClose}>
      <SectionCard style={styles.card}>
        <HeaderText>Nastaviť cieľ obchodovania</HeaderText>
        <View style={styles.row}>
          <InputField
            label="Cieľová suma (€)"
            placeholder="Zadaj sumu"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            disabled={submitting}
            error={error}
          />
        </View>
        <View style={styles.row}>
          <DateField
            label="Cieľový dátum"
            placeholder="Vyber dátum"
            date={date}
            onSelect={setDate}
            min={today}
            disabled={submitting}
            error={error}
          />
        </View>
        <ErrorText message={error} />
        <View style={styles.buttonsRow}>
          <GhostButton text="Uložiť cieľ" onPress={handleSave} disabled={submitting} />
          <GhostButton text="Zrušiť" onPress={onClose} disabled={submitting} />
        </View>
      </SectionCard>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: '66%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.sm,
    justifyContent: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
});

export default GoalModal;
