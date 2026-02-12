import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../../styles/colors';

type PrimaryActionButtonProps = {
  label: string;
  onPress: () => void;
};

function PrimaryActionButton({ label, onPress }: PrimaryActionButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default PrimaryActionButton;
