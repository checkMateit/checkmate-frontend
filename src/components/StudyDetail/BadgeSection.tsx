import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../styles/colors';

type BadgeItem = {
  image: ImageSourcePropType;
  title: string;
  description: string;
};

type BadgeSectionProps = {
  title: string;
  badges: BadgeItem[];
};

function BadgeSection({ title, badges }: BadgeSectionProps) {
  return (
    <View style={styles.badgeCard}>
      <Text style={styles.badgeTitle}>{title}</Text>
      <View style={styles.badgeRow}>
        {badges.map((badge, index) => (
          <View key={`${badge.title}-${index}`} style={styles.badgeItem}>
            <Image source={badge.image} style={styles.badgeImage} />
            <Text style={styles.badgeLabel}>{badge.title}</Text>
            <Text style={styles.badgeDesc}>{badge.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 7,
    backgroundColor: '#F2FEF7',
    marginBottom: 22,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
  },
  badgeImage: {
    width: 42,
    height: 54,
    marginBottom: 8,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default BadgeSection;
