import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type PointsExchangeSummaryCardProps = {
  pointsLabel: string;
  onPressExchange?: () => void;
};

function PointsExchangeSummaryCard({
  pointsLabel,
  onPressExchange,
}: PointsExchangeSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>내 포인트</Text>
      <Text style={styles.points}>{pointsLabel}</Text>
      <Pressable style={styles.button} onPress={onPressExchange}>
        <Text style={styles.buttonText}>환전하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginTop: 12,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  points: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2A2A2A',
    marginTop: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },
});

export default PointsExchangeSummaryCard;
