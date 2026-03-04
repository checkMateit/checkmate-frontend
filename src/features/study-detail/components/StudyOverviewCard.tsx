import React from 'react';
import { Image, ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import AuthMethodRow from '../../../components/common/AuthMethodRow';

type StudyOverviewCardProps = {
  tag: string;
  title: string;
  members: string;
  description: string;
  schedule: string;
  methods?: string[];
  image?: ImageSourcePropType;
  authTimes?: { method: string; time: string; deadline?: string; complete?: string }[];
  authDays?: string;
  period?: string;
};

const categoryIcon = require('../../../assets/icon/category_icon.png');
const personIcon = require('../../../assets/icon/person_icon.png');
const timeIcon = require('../../../assets/icon/time_icon.png');
const pencilIcon = require('../../../assets/icon/modify_icon.png');
const defaultStudyImage = require('../../../assets/character/ch_3.png');

/** 요일만 표시: "화/수/목 22:00" → "화/수/목", "화목" → "화/목" */
function formatDaysOnly(authDays?: string): string {
  if (!authDays || authDays === '-') return '';
  const dayPart = (authDays.split(/\s+/)[0] ?? authDays).trim();
  if (dayPart.includes('/')) return dayPart;
  return dayPart.split('').join('/');
}

function StudyOverviewCard({
  tag,
  title,
  members,
  description,
  schedule,
  methods,
  image,
  authTimes,
  authDays,
  period,
}: StudyOverviewCardProps) {
  const methodsList = methods ?? [];
  const authRows =
    authTimes && authTimes.length > 0
      ? authTimes.map((item) => ({
          method: item.method,
          time: item.time,
          deadline: item.deadline,
          complete: item.complete,
        }))
      : methodsList.map((method) => ({ method, time: '-', deadline: undefined, complete: undefined }));

  const periodDisplay = period && period !== '-' ? period : schedule;
  const daysOnlyDisplay = formatDaysOnly(authDays);
  const imageSource = image ?? defaultStudyImage;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <ImageBackground source={categoryIcon} style={styles.tagChip} resizeMode="contain">
          <Text style={styles.tagText}>{tag}</Text>
        </ImageBackground>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.avatarWrap}>
          <Image source={imageSource} style={styles.avatar} resizeMode="cover" />
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
          <Text style={styles.detailLabel}>기간</Text>
          <Text style={styles.detailValue}>{periodDisplay}</Text>
        </View>
        {daysOnlyDisplay ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>요일</Text>
            <Text style={styles.detailValue}>{daysOnlyDisplay}</Text>
          </View>
        ) : null}
        <View style={styles.methodRow}>
          <Text style={styles.detailLabel}>방식</Text>
          <View style={styles.methodColumn}>
            {authRows.length > 0 ? (
              <View style={styles.methodTwoCol}>
                <View style={styles.methodChipsCol}>
                  {authRows.map((row, idx) => (
                    <AuthMethodRow key={`chip-${idx}`} methods={[row.method]} label="" showIcon={false} />
                  ))}
                </View>
                <View style={styles.methodTimesCol}>
                  {authRows.map((row, idx) =>
                    row.method === 'TODO' && (row.deadline != null || row.complete != null) ? (
                      <View key={`time-${idx}`} style={styles.methodTimeRow}>
                        <Image source={pencilIcon} style={styles.methodTimeIcon} resizeMode="contain" />
                        <Text style={styles.methodTime}>{row.deadline ?? '-'}</Text>
                        <Image source={timeIcon} style={styles.methodTimeIcon} resizeMode="contain" />
                        <Text style={styles.methodTime}>{row.complete ?? row.time}</Text>
                      </View>
                    ) : (
                      <View key={`time-${idx}`} style={styles.methodTimeRow}>
                        <Image source={timeIcon} style={styles.methodTimeIcon} resizeMode="contain" />
                        <Text style={styles.methodTime}>{row.time}</Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
            ) : (
              <Text style={styles.methodTime}>-</Text>
            )}
          </View>
        </View>
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
  detailLabel: {
    width: 28,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  detailIcon: {
    width: 12,
    height: 12,
    tintColor: colors.textSecondary,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#515151',
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  methodColumn: {
    flex: 1,
  },
  methodTwoCol: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  methodChipsCol: {
    gap: 8,
    minWidth: 52,
  },
  methodTimesCol: {
    flex: 1,
    gap: 8,
  },
  methodTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodTimeIcon: {
    width: 12,
    height: 12,
    tintColor: colors.textSecondary,
  },
  methodTime: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
  },
});

export default StudyOverviewCard;
