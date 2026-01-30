import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type PointsShopBalanceBarProps = {
  pointsLabel: string;
  onPressExchange?: () => void;
};

function PointsShopBalanceBar({ pointsLabel, onPressExchange }: PointsShopBalanceBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Text style={styles.pillText}>{pointsLabel}</Text>
      </View>
      <Pressable onPress={onPressExchange}>
        <Text style={styles.exchangeText}>포인트 환전하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D2D2D',
  },
  exchangeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default PointsShopBalanceBar;
