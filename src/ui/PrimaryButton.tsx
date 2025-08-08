// src/ui/PrimaryButton.tsx

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { tokens } from '../theme/tokens';

interface Props {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

const PrimaryButton: React.FC<Props> = ({ children, onPress, disabled }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonActive,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: 'rgba(64, 97, 225, 0.25)',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: tokens.colors.textPrimary,
    fontFamily: tokens.font.family,
    fontWeight: tokens.font.weightBold,
    fontSize: 15,
  },
});

export default PrimaryButton;
