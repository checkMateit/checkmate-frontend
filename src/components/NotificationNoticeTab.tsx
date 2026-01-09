import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

const badgeOne = require('../assets/badge/badge_1.png');

function NotificationNoticeTab() {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>오늘</Text>
        <Text style={styles.clearText}>전체삭제</Text>
      </View>

      <View style={styles.noticeCard}>
        <View style={styles.noticeText}>
          <Text style={styles.noticeTitle}>승연님 이번주 ○○스터디룸 랭킹 1위 달성!</Text>
          <Text style={styles.noticeDesc}>이번주 수고한 승연님께 드리는 1등 뱃지 도착</Text>
        </View>
        <Image source={badgeOne} style={styles.noticeBadge} />
      </View>

      <View style={styles.skeletonCard}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
      </View>

      <View style={styles.skeletonCard}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>이전 알림</Text>
        <Text style={styles.clearText}>전체삭제</Text>
      </View>

      <View style={styles.filterRow}>
        <View style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>전체</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>이벤트</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>공지</Text>
        </View>
      </View>

      <View style={styles.skeletonCardLarge} />
      <View style={styles.skeletonCardLarge} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 12,
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
    width: 44,
    height: 44,
  },
  skeletonCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  skeletonLine: {
    height: 10,
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
    marginBottom: 10,
  },
  skeletonLineShort: {
    width: '70%',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
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
    color: colors.primary,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  skeletonCardLarge: {
    height: 80,
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    marginBottom: 12,
  },
});

export default NotificationNoticeTab;
