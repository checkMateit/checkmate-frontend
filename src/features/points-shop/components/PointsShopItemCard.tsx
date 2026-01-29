import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type PointsShopItemCardProps = {
  label: string;
  priceLabel: string;
  iconSource: ImageSourcePropType;
};

function PointsShopItemCard({ label, priceLabel, iconSource }: PointsShopItemCardProps) {
  return (
    <View style={styles.card}>
      <Image source={iconSource} style={styles.ticketIcon} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pricePill}>
        <Text style={styles.priceText}>{priceLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%',
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketIcon: {
    width: 70,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 8,
  },
  pricePill: {
    backgroundColor: '#2F2F2F',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default PointsShopItemCard;
