import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

function NotificationStudyTab() {
  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <View style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>전체</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>○○ 스터디</Text>
        </View>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>토익 스터디</Text>
        </View>
      </View>

      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Text style={styles.postTag}>토익 스터디</Text>
        </View>
        <Text style={styles.postTitle}>혹시 이 문제 답이 왜 이런지 아시는 분?</Text>
        <Text style={styles.postDesc}>
          한시간 째 문제를 보고 있는데도 이유를 모르겠어요. 혹시 아시는 분 알려주세요!!
        </Text>
        <View style={styles.postFooter}>
          <Text style={styles.postMeta}>👍 2</Text>
          <Text style={styles.postMeta}>💬 3</Text>
          <View style={styles.postImage} />
        </View>
      </View>

      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Text style={styles.postTag}>○○ 스터디</Text>
        </View>
        <Text style={styles.postTitle}>오류나요 자꾸..</Text>
        <Text style={styles.postDesc}>
          왜 자꾸 여기서 오류가 날까요ㅠㅠ 전문가님 도와주세요
        </Text>
        <View style={styles.postFooter}>
          <Text style={styles.postMeta}>👍 1</Text>
          <Text style={styles.postMeta}>💬 1</Text>
          <View style={styles.postImage} />
        </View>
      </View>

      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Text style={styles.postTag}>○○ 스터디</Text>
        </View>
        <Text style={styles.postTitle}>오류나요 자꾸..</Text>
        <Text style={styles.postDesc}>
          왜 자꾸 여기서 오류가 날까요ㅠㅠ 전문가님 도와주세요
        </Text>
        <View style={styles.postFooter}>
          <Text style={styles.postMeta}>👍 1</Text>
          <Text style={styles.postMeta}>💬 1</Text>
          <View style={styles.postImage} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
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
  postCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  postHeader: {
    marginBottom: 8,
  },
  postTag: {
    fontSize: 11,
    color: '#9A9A9A',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  postDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postMeta: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  postImage: {
    marginLeft: 'auto',
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotificationStudyTab;
