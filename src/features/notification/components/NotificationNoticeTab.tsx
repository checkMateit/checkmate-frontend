import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import NotificationEmptyState from './NotificationEmptyState';

const badgeOne = require('../../../assets/badge/badge_1.png');

type NoticeItem = {
  id: number;
  title: string;
  description: string;
  badge: number;
  category: '이벤트' | '공지';
};

type NoticeSectionProps = {
  title: string;
  notices: NoticeItem[];
  onClear: () => void;
  showFilters?: boolean;
  activeFilter?: '전체' | NoticeItem['category'];
  onChangeFilter?: (filter: '전체' | NoticeItem['category']) => void;
};

function NoticeSection({
  title,
  notices,
  onClear,
  showFilters = false,
  activeFilter = '전체',
  onChangeFilter,
}: NoticeSectionProps) {
  return (
    <View style={styles.sectionBlock}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Pressable onPress={onClear} accessibilityRole="button">
          <Text style={styles.clearText}>전체삭제</Text>
        </Pressable>
      </View>

      {showFilters && (
        <View style={styles.filterRow}>
          {(['전체', '이벤트', '공지'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => onChangeFilter?.(filter)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {notices.map((notice) => (
        <View key={notice.id} style={styles.noticeCard}>
          <View style={styles.noticeText}>
            <Text style={styles.noticeTitle}>{notice.title}</Text>
            <Text style={styles.noticeDesc}>{notice.description}</Text>
          </View>
          <Image source={notice.badge} style={styles.noticeBadge} />
        </View>
      ))}
    </View>
  );
}

function NotificationNoticeTab() {
  const [todayNotices, setTodayNotices] = useState<NoticeItem[]>([
    {
      id: 1,
      title: '승연님 이번주 ○○스터디룸 랭킹 1위 달성!',
      description: '이번주 수고한 승연님께 드리는 1등 뱃지 도착',
      badge: badgeOne,
      category: '이벤트',
    },
  ]);
  const [previousNotices, setPreviousNotices] = useState<NoticeItem[]>([
    {
      id: 2,
      title: '○○스터디룸 오늘 인증 완료!',
      description: '오늘의 인증이 기록되었어요.',
      badge: badgeOne,
      category: '공지',
    },
    {
      id: 3,
      title: '주간 랭킹이 업데이트되었어요!',
      description: '이번 주 랭킹을 확인해보세요.',
      badge: badgeOne,
      category: '이벤트',
    },
  ]);
  const [previousFilter, setPreviousFilter] = useState<'전체' | NoticeItem['category']>(
    '전체',
  );

  const filteredPreviousNotices =
    previousFilter === '전체'
      ? previousNotices
      : previousNotices.filter((notice) => notice.category === previousFilter);

  const hasToday = todayNotices.length > 0;
  const hasPrevious = filteredPreviousNotices.length > 0;
  const hasAnyNotice = hasToday || hasPrevious;

  if (!hasAnyNotice) {
    return (
      <NotificationEmptyState
        title="알림이 아직 없어요"
        description={`새로운 소식이 생기면\n바로 알려드릴게요.`}
      />
    );
  }

  return (
    <View style={styles.container}>
      {hasToday && (
        <NoticeSection
          title="오늘"
          notices={todayNotices}
          onClear={() => setTodayNotices([])}
        />
      )}
      {hasPrevious && (
        <NoticeSection
          title="이전 알림"
          notices={filteredPreviousNotices}
          onClear={() => setPreviousNotices([])}
          showFilters
          activeFilter={previousFilter}
          onChangeFilter={setPreviousFilter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionBlock: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  clearText: {
    fontSize: 12,
    color: '#9A9A9A',
  },
  noticeCard: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  noticeText: {
    flex: 1,
    paddingRight: 12,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  noticeDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  noticeBadge: {
    width: 42,
    height: 54,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: '#373737',
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#373737',
  },
});

export default NotificationNoticeTab;
