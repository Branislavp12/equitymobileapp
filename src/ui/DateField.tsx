// src/ui/DateField.tsx

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { tokens } from '../theme/tokens';

interface Props {
  label: string;
  date: Date | null;
  onSelect: (date: Date) => void;
  placeholder?: string;
  min?: Date;
  disabled?: boolean;
  error?: string;
}

const DateField: React.FC<Props> = ({
  label,
  date,
  onSelect,
  placeholder = 'Vyber dátum',
  min,
  disabled,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onSelect(selectedDate);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => !disabled && setShowPicker(true)}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[styles.input, error && styles.inputError]}
        >
          <Text style={styles.inputText}>
            {date ? date.toLocaleDateString('sk-SK') : placeholder}
          </Text>
        </View>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={min}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    minWidth: 120,
  },
  label: {
    color: tokens.colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
    fontFamily: tokens.font.family,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.textMuted,
    paddingVertical: tokens.spacing.xs,
  },
  inputError: {
    borderBottomColor: tokens.colors.accentRed,
  },
  inputText: {
    color: tokens.colors.textPrimary,
    fontFamily: tokens.font.family,
    fontSize: 16,
  },
});

export default DateField;
