// src/ui/InputField.tsx

import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TextInputProps } from 'react-native';
import { tokens } from '../theme/tokens';

interface Props {
  label: string;
  value: string;
  onChangeText: (val: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
}

const InputField: React.FC<Props> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled,
  keyboardType = 'default',
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelWrapper}>
        <View>
          <TextInput
            style={[
              styles.input,
              focused && styles.inputFocused,
              error && styles.inputError,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={tokens.colors.textMuted}
            editable={!disabled}
            keyboardType={keyboardType}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    minWidth: 120,
  },
  labelWrapper: {
    marginBottom: 4,
  },
  input: {
    color: tokens.colors.textPrimary,
    fontFamily: tokens.font.family,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.textMuted,
    paddingVertical: tokens.spacing.xs,
    paddingHorizontal: 0,
  },
  inputFocused: {
    borderBottomColor: tokens.colors.accentBlue,
  },
  inputError: {
    borderBottomColor: tokens.colors.accentRed,
  },
});

export default InputField;
