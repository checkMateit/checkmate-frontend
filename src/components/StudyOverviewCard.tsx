import React from 'react';
import { Image, ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

type StudyOverviewCardProps = {
  tag: string;
  title: string;
  members: string;
  description: string;
  schedule: string;
  count: string;
  methods: string[];
  image: ImageSourcePropType;
};

const categoryIcon = require('../assets/icon/category_icon.png');
const personIcon = require('../assets/icon/person_icon.png');
const timeIcon = require('../assets/icon/time_icon.png');

function StudyOverviewCard({
  tag,
  title,
  members,
  description,
  schedule,
  count,
  methods,
  image,
}: StudyOverviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <ImageBackground source={categoryIcon} style={styles.tagChip} resizeMode="contain">
          <Text style={styles.tagText}>{tag}</Text>
        </ImageBackground>
        <View style={styles.memberRow}>
          <Image source={personIcon} style={styles.memberIcon} />
          <Text style={styles.memberText}>{members}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.avatarWrap}>
          <Image source={image} style={styles.avatar} resizeMode="cover" />
        </View>
        <View style={styles.infoText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{description}</Text>
        </View>
      </View>
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <Image source={timeIcon} style={styles.detailIcon} />
          <Text style={styles.detailText}>{schedule}</Text>
          <Text style={styles.detailDivider}>|</Text>
          <Text style={styles.detailText}>횟수</Text>
          <Text style={styles.detailValue}>{count}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>방식</Text>
          {methods.map((method) => (
            <View key={method} style={styles.methodChip}>
              <View style={styles.methodBar} />
              <Text style={styles.methodText}>{method}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  tagChip: {
    height: 22,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberIcon: {
    width: 14,
    height: 14,
    tintColor: colors.primary,
  },
  memberText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailBox: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  detailIcon: {
    width: 12,
    height: 12,
    tintColor: colors.textSecondary,
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailDivider: {
    color: '#C8C8C8',
  },
  detailValue: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  methodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  methodBar: {
    width: 4,
    height: '100%',
    backgroundColor: colors.primary,
  },
  methodText: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 11,
    color: colors.textSecondary,
  },
});

export default StudyOverviewCard;
