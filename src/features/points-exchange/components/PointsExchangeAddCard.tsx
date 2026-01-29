import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';


type PointsExchangeAddCardProps = {
  onPress?: () => void;
};

function PointsExchangeAddCard({ onPress }: PointsExchangeAddCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9A9A9A',
  },
});

export default PointsExchangeAddCard;
