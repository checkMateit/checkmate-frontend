import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

type RankingItem = {
  name: string;
  percent: number;
  badge: number;
  profile: number;
  tag: string;
};

type RankingChartStripProps = {
  items: RankingItem[];
};

function RankingChartStrip({ items }: RankingChartStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chartRow}
    >
      {items.map((item, index) => (
        <View key={`${item.name}-${index}`} style={styles.chartItem}>
          <View style={styles.chartBarWrap}>
            <View style={[styles.chartBarFill, { height: `${item.percent}%` }]} />
          </View>
          <Image source={item.profile} style={styles.profile} />
          <Text style={styles.chartName}>{item.name}</Text>
          <Text style={styles.chartScore}>{item.percent}%</Text>
          <Image source={item.badge} style={styles.badge} />
          <View style={styles.badgeTag}>
            <Text style={styles.badgeTagText}>{item.tag}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chartRow: {
    gap: 16,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  chartItem: {
    alignItems: 'center',
  },
  chartBarWrap: {
    width: 24,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#E6E6E6',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  profile: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginBottom: 6,
  },
  chartName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chartScore: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 6,
  },
  badge: {
    width: 28,
    height: 28,
    marginBottom: 6,
  },
  badgeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F1F1',
  },
  badgeTagText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});

export default RankingChartStrip;
