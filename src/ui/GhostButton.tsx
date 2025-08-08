// src/ui/GhostButton.tsx

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { tokens } from "../theme/tokens";

interface Props {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

const GhostButton: React.FC<Props> = ({ text, onPress, disabled }) => {
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
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: tokens.radius.md,
    alignItems: "center",
    paddingVertical: tokens.spacing.sm,
    backgroundColor: tokens.colors.transparent,
  },
  buttonActive: {
    backgroundColor: "rgba(64, 97, 225, 0.15)",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: tokens.colors.accentBlue,
    fontFamily: tokens.font.family,
    fontWeight: tokens.font.weightBold,
    fontSize: 14,
  },
});

export default GhostButton;