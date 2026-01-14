import React from 'react';
import { Image, ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../styles/colors';
import AuthMethodRow from '../Common/AuthMethodRow';

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

const categoryIcon = require('../../assets/icon/category_icon.png');
const personIcon = require('../../assets/icon/person_icon.png');
const timeIcon = require('../../assets/icon/time_icon.png');

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
      </View>
      <View style={styles.infoRow}>
        <View style={styles.avatarWrap}>
          <Image source={image} style={styles.avatar} resizeMode="cover" />
        </View>
        <View style={styles.infoText}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.memberRow}>
              <Image source={personIcon} style={styles.memberIcon} />
              <Text style={styles.memberText}>{members}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>{description}</Text>
        </View>
      </View>
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <Image source={timeIcon} style={styles.detailIcon} />
          <Text style={styles.detailValue}>{schedule}</Text>
          <View style={styles.detailDivider} />
          <Text style={styles.detailText}>횟수</Text>
          <Text style={styles.detailValue}>{count}</Text>
        </View>
        <AuthMethodRow methods={methods} label="방식" showIcon={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 35,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberIcon: {
    width: 14,
    height: 10,
    tintColor: colors.primary,
  },
  memberText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  avatarWrap: {
    width: 71,
    height: 71,
    borderRadius: 7,
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
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  detailBox: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    padding: 18,
    gap: 15,
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
    fontSize: 13,
    fontWeight:'700',
    color: '#515151',
  },
  detailDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#C8C8C8',
    marginHorizontal: 6,
  },
  detailValue: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default StudyOverviewCard;
