import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import BadgeSection from './BadgeSection';
import CalendarSection from './CalendarSection';
import { colors } from '../../../styles/colors';
import { getMyInfo } from '../../../api/users';
import { fetchMyStudyGroups } from '../../../api/studyGroups';
import { fetchVerificationRecords, type VerificationRecordItemRes } from '../../../api/studyGroups';
import { getCurrentUserId } from '../../../api/client';

type HistoryStatsTabProps = {
  currentMonth: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
};

const badgeOne = require('../../../assets/badge/badge_1.png');
const badgeTwo = require('../../../assets/badge/badge_2.png');
const badgeThree = require('../../../assets/badge/badge_3.png');
const badgeFour = require('../../../assets/badge/badge_4.png');
const badgeFive = require('../../../assets/badge/badge_5.png');

const DEFAULT_BADGES = [
  { image: badgeOne, title: 'Top Mate', description: '○○스터디 인증 1등' },
  { image: badgeTwo, title: 'MVP', description: '총합점수 1등' },
  { image: badgeThree, title: '뱃지 수집가', description: '뱃지 총 10개 달성' },
  { image: badgeFour, title: '꾸준함', description: '한 달 연속 인증' },
  { image: badgeFive, title: '베스트 루키', description: '첫 달 최다 인증' },
  { image: badgeOne, title: '풀참여', description: '모든 스터디 참여' },
  { image: badgeTwo, title: '피니셔', description: '프로젝트 완주' },
  { image: badgeThree, title: '성실상', description: '주간 인증 7회' },
  { image: badgeFour, title: '도전왕', description: '새 목표 3회' },
  { image: badgeFive, title: '후기왕', description: '피드백 10회' },
];

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function aggregateMyVerificationCountByDate(
  records: VerificationRecordItemRes[],
  myUserId: string,
): Record<string, number> {
  const countByDate: Record<string, number> = {};
  records.forEach((r) => {
    if (r.userId !== myUserId) return;
    const key = r.verificationDate?.split('T')[0] ?? r.verificationDate;
    if (!key) return;
    countByDate[key] = (countByDate[key] ?? 0) + 1;
  });
  return countByDate;
}

function HistoryStatsTab({
  currentMonth,
  selectedDate,
  onSelectDate,
  onChangeMonth,
}: HistoryStatsTabProps) {
  const [userName, setUserName] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [countByDate, setCountByDate] = useState<Record<string, number>>({});
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [badgeItems] = useState(DEFAULT_BADGES);

  const myUserId = getCurrentUserId();

  const monthStart = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    return new Date(y, m, 1);
  }, [currentMonth]);
  const monthEnd = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    return new Date(y, m + 1, 0);
  }, [currentMonth]);
  const startStr = toDateKey(monthStart);
  const endStr = toDateKey(monthEnd);

  useEffect(() => {
    let cancelled = false;
    setLoadingUser(true);
    getMyInfo()
      .then((res) => {
        if (cancelled) return;
        const data = (res.data as { data?: { nickname?: string; name?: string } })?.data;
        const displayName = data?.nickname?.trim() || data?.name?.trim() || '메이트';
        setUserName(displayName);
      })
      .catch(() => {
        if (!cancelled) setUserName('메이트');
      })
      .finally(() => {
        if (!cancelled) setLoadingUser(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadRecords = useCallback(async () => {
    if (!myUserId) {
      setCountByDate({});
      setLoadingRecords(false);
      return;
    }
    setLoadingRecords(true);
    try {
      const { data: groupsRes } = await fetchMyStudyGroups();
      const list = Array.isArray((groupsRes as { data?: unknown[] })?.data)
        ? (groupsRes as { data: { groupId: number }[] }).data
        : [];
      const allRecords: VerificationRecordItemRes[] = [];
      await Promise.all(
        list.map(async (card) => {
          try {
            const { data: recRes } = await fetchVerificationRecords(card.groupId, {
              startDate: startStr,
              endDate: endStr,
            });
            const recs = (recRes as { data?: { records?: VerificationRecordItemRes[] } })?.data?.records ?? [];
            allRecords.push(...recs);
          } catch {
            // ignore per-group errors
          }
        }),
      );
      const byDate = aggregateMyVerificationCountByDate(allRecords, myUserId);
      setCountByDate(byDate);
    } catch {
      setCountByDate({});
    } finally {
      setLoadingRecords(false);
    }
  }, [myUserId, startStr, endStr]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const monthTotal = useMemo(() => {
    return Object.values(countByDate).reduce((sum, n) => sum + n, 0);
  }, [countByDate]);

  const monthLabel = `${currentMonth.getMonth() + 1}월`;
  const badgeTitle = `${currentMonth.getMonth() + 1}월의 뱃지`;

  return (
    <View>
      <View style={styles.profileBlock}>
        {loadingUser ? (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
        ) : (
          <Text style={styles.profileName}>{userName} 메이트님</Text>
        )}
        <Text style={styles.profileSubtitle}>
          {monthLabel}에는 총 {monthTotal}번 인증했어요!
        </Text>
      </View>

      <BadgeSection title={badgeTitle} badges={badgeItems} />

      <CalendarSection
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        onChangeMonth={onChangeMonth}
        verificationCountByDate={countByDate}
        loading={loadingRecords}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileBlock: {
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  profileSubtitle: {
    fontSize: 19,
    color: '#373737',
    fontWeight: '600',
  },
  loader: {
    marginVertical: 4,
  },
});

export default HistoryStatsTab;
