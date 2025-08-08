// src/ui/ModalContainer.tsx

import React from "react";
import { Modal } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

const ModalContainer: React.FC<{
  visible: boolean;
  onBackdropPress: () => void;
  children: React.ReactNode;
}> = ({ visible, onBackdropPress, children }) => (
  <Modal
    visible={visible}
    onBackdropPress={onBackdropPress}
    backdropStyle={styles.backdrop}
  >
    {children}
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ModalContainer;
