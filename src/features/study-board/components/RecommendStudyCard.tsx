import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import AuthMethodRow from '../../../components/common/AuthMethodRow';

type RecommendStudyCardProps = {
  tag: string;
  members: string;
  title: string;
  time: string;
  method: string;
  period?: string;
  authDays?: string;
  authTimes?: { method: string; time: string; deadline?: string; complete?: string }[];
  onPress?: () => void;
};

const timeIcon = require('../../../assets/icon/time_icon.png');
const personIcon = require('../../../assets/icon/person_icon.png');
const rightIcon = require('../../../assets/icon/right_arrow.png');

/** 요일만: "화/수/목 22:00" → "화/수/목", "화목" → "화/목" */
function daysOnly(s?: string): string {
  if (!s || s === '-') return '';
  const part = (s.split(/\s+/)[0] ?? s).trim();
  if (part.includes('/')) return part;
  return part.split('').join('/');
}

/** 시계 옆에는 시간만 표시. 요일·영문 등 제거 후 HH:MM 형태만 반환 */
function timeOnly(s?: string): string {
  if (!s || s === '-') return s ?? '-';
  const t = s.trim();
  const parts = t.split(/\s+/);
  const timeParts = parts.filter((p) => /\d{1,2}:\d{2}/.test(p));
  return timeParts.length > 0 ? timeParts.join(' ') : t;
}

function RecommendStudyCard({
  tag,
  members,
  title,
  time,
  method,
  period,
  authDays,
  authTimes,
  onPress,
}: RecommendStudyCardProps) {
  const periodDisplay = period && period !== '-' ? period : null;
  const daysOnlyStr = daysOnly(authDays);
  const authRows =
    authTimes && authTimes.length > 0
      ? authTimes
      : [{ method, time }];

  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <ImageBackground
            source={require('../../../assets/icon/category_icon.png')}
            style={styles.category}
            resizeMode="contain"
          >
            <Text style={styles.chipText}>{tag}</Text>
          </ImageBackground>
          <View style={styles.membersRow}>
            <Image source={personIcon} style={styles.membersIcon} />
            <Text style={styles.membersText}>{members}</Text>
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        {periodDisplay ? (
          <Text style={styles.metaText} numberOfLines={1}>{periodDisplay}</Text>
        ) : null}
        {daysOnlyStr ? (
          <Text style={styles.metaText}>{daysOnlyStr}</Text>
        ) : null}
        <View style={styles.methodBlock}>
          <Text style={styles.methodLabel}>인증방식</Text>
          <View style={styles.methodList}>
            {authRows.map((item, index) => (
              <View key={`${item.method}-${index}`} style={styles.methodLine}>
                <View style={styles.methodChipWrap}>
                  <AuthMethodRow methods={[item.method]} label="" showIcon={false} />
                </View>
                <View style={styles.methodTimeRow}>
                  <Image source={timeIcon} style={styles.methodTimeIcon} />
                  <Text style={styles.methodTimeText}>
                    {timeOnly(item.method === 'TODO' ? (item.complete ?? item.time) : item.time)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>자세히 보기</Text>
          <Image source={rightIcon} style={styles.footerIcon} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 162,
    height: 230,
    backgroundColor: '#F4FCF7',
    borderRadius: 16,
    paddingTop: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.13,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    paddingHorizontal: 12,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  timeIcon: {
    width: 10,
    height: 10,
    tintColor: colors.textSecondary,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  membersIcon: {
    width: 13,
    height: 9,
    tintColor: colors.primary,
  },
  membersText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  methodBlock: {
    marginBottom: 10,
  },
  methodLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '700',
  },
  methodList: {
    gap: 4,
  },
  methodLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  methodChipWrap: {
    minWidth: 52,
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
  methodTimeText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  footer: {

    borderTopWidth: 1,
    borderTopColor: '#E6F2EA',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: -14,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: 'auto',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#8A9B90',
    fontWeight: '600',
  },
  footerIcon: {
    width: 4,
    height: 8,
    tintColor: '#BDCAC3',
  },
});

export default RecommendStudyCard;
