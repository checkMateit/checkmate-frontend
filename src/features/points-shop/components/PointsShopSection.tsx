import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PointsShopItemCard from './PointsShopItemCard';

export type PointsShopItem = {
  id: string;
  label: string;
  priceLabel: string;
  iconSource: ReturnType<typeof require>;
  iconSize?: {
    width: number;
    height: number;
  };
};

type PointsShopSectionProps = {
  title: string;
  items: PointsShopItem[];
};

function PointsShopSection({ title, items }: PointsShopSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <PointsShopItemCard
            key={item.id}
            label={item.label}
            priceLabel={item.priceLabel}
            iconSource={item.iconSource}
            iconSize={item.iconSize}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    
    justifyContent: 'space-between',
  },
});

export default PointsShopSection;
