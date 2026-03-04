import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import StatusFailIcon from '../../../components/common/StatusFailIcon';

const checkIcon = require('../../../assets/icon/check_icon.png');
import { fetchStudyGroupMembers } from '../../../api/studyGroups';
import { fetchVerificationRecords } from '../../../api/studyGroups';
import type { StudyGroupMemberRes } from '../../../api/studyGroups';
import type { TodoSchedule } from './StudyStatusTodo';
import { isAfterTimeInKST } from '../../../utils/timeKST';

type StudyStatusTodoOthersProps = {
  groupId: string;
  slot: number;
  currentUserId: string | null;
  date: string;
  schedule?: TodoSchedule;
};

type MemberStatus = {
  userId: string;
  nickname: string;
  passed: boolean | null;
};

function StudyStatusTodoOthers({
  groupId,
  slot,
  currentUserId,
  date,
  schedule,
}: StudyStatusTodoOthersProps) {
  const [members, setMembers] = useState<StudyGroupMemberRes[]>([]);
  const [recordUserIds, setRecordUserIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetchStudyGroupMembers(groupId),
      fetchVerificationRecords(groupId, { startDate: date, endDate: date }),
    ])
      .then(([membersRes, recordsRes]) => {
        const list = (membersRes.data?.data ?? []).filter(
          (m) => m.status === 'ACTIVE',
        );
        setMembers(list);
        const records = recordsRes.data?.data?.records ?? [];
        const set = new Set<string>();
        records.forEach((r) => {
          if (r.slot === slot && r.verificationDate === date) {
            set.add(r.userId);
          }
        });
        setRecordUserIds(set);
      })
      .catch(() => {
        setMembers([]);
        setRecordUserIds(new Set());
      })
      .finally(() => setLoading(false));
  }, [groupId, slot, date]);

  useEffect(() => {
    load();
  }, [load]);

  const checkEndTimePassed = Boolean(
    schedule?.checkEndTime && isAfterTimeInKST(schedule.checkEndTime),
  );

  const othersWithStatus = useMemo((): MemberStatus[] => {
    return members
      .filter((m) => m.userId !== currentUserId)
      .map((m) => ({
        userId: m.userId,
        nickname: (m.nickname?.trim() || '회원').replace(/\s*님$/, '') || '회원',
        passed: checkEndTimePassed ? recordUserIds.has(m.userId) : null,
      }));
  }, [members, currentUserId, recordUserIds, checkEndTimePassed]);

  if (loading) {
    return (
      <View style={styles.wrap}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>그룹원 현황 불러오는 중…</Text>
        </View>
      </View>
    );
  }

  if (othersWithStatus.length === 0) {
    return null;
  }

  return (
    <View style={styles.gridRow}>
      {othersWithStatus.map((member) => (
        <View key={member.userId} style={styles.todoSmall}>
          <Text style={styles.smallName}>{member.nickname}님</Text>
          <View style={styles.statusWrap}>
            {member.passed === null ? (
              <Text style={styles.statusWait}>체크 마감 전</Text>
            ) : member.passed ? (
              <>
                <Text style={styles.statusPass}>인증 완료</Text>
                <Image source={checkIcon} style={styles.statusIcon} />
              </>
            ) : (
              <>
                <Text style={styles.statusFail}>미인증</Text>
                <StatusFailIcon size={11} />
              </>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  todoSmall: {
    minWidth: 100,
    flex: 1,
    maxWidth: 160,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    padding: 12,
  },
  smallName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  statusWrap: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIcon: {
    width: 11,
    height: 11,
  },
  statusPass: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  statusFail: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E57373',
  },
  statusWait: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default StudyStatusTodoOthers;
