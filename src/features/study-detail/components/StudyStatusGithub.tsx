import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';
import { fetchStudyGroupMembers, fetchVerificationRecords } from '../../../api/studyGroups';
import type { StudyGroupMemberRes } from '../../../api/studyGroups';
import { getCurrentUserId } from '../../../api/client';
import { getVerificationDateToday } from '../../../api/verification';
import StatusFailIcon from '../../../components/common/StatusFailIcon';

const profileImage = require('../../../assets/icon/profile_1.png');
const checkIcon = require('../../../assets/icon/check_icon.png');

function displayName(member: StudyGroupMemberRes): string {
  if (member.nickname?.trim()) return member.nickname.trim();
  if (member.role === 'Leader') return '방장';
  const short = member.userId.replace(/-/g, '').slice(-8);
  return short ? `…${short}` : '회원';
}

type StudyStatusGithubProps = {
  groupId: string;
  slot: number;
  schedule?: { endTime?: string };
};

function StudyStatusGithub({ groupId, slot }: StudyStatusGithubProps) {
  const [members, setMembers] = useState<StudyGroupMemberRes[]>([]);
  const [recordSet, setRecordSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const date = getVerificationDateToday();
  const currentUserId = getCurrentUserId();

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetchStudyGroupMembers(groupId),
      fetchVerificationRecords(groupId, { startDate: date, endDate: date }),
    ])
      .then(([membersRes, recordsRes]) => {
        const memberList = (membersRes.data?.data ?? []).filter(
          (m) => m.status === 'ACTIVE',
        );
        setMembers(Array.isArray(memberList) ? memberList : []);
        const records = recordsRes.data?.data?.records ?? [];
        const set = new Set<string>();
        records
          .filter((r: { slot: number }) => r.slot === slot)
          .forEach((r: { userId: string; slot: number; verificationDate: string }) => {
            set.add(`${r.userId}-${r.slot}-${r.verificationDate}`);
          });
        setRecordSet(set);
      })
      .catch(() => {
        setMembers([]);
        setRecordSet(new Set());
      })
      .finally(() => setLoading(false));
  }, [groupId, slot, date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>불러오는 중…</Text>
        </View>
      </View>
    );
  }

  const myRecord = recordSet.has(`${currentUserId}-${slot}-${date}`);
  const myMember = members.find((m) => m.userId === currentUserId);
  const myDisplayName = myMember ? displayName(myMember) : '나';

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {/* 나의 GitHub 인증 카드 */}
        <View style={[styles.row, styles.myCard]}>
          <Image source={profileImage} style={styles.avatar} />
          <View style={styles.content}>
            <Text style={styles.name}>{myDisplayName} 님</Text>
            <View style={styles.statusWrap}>
              <Text
                style={[
                  styles.statusText,
                  myRecord ? styles.statusPass : styles.statusFail,
                ]}
              >
                {myRecord ? '완료' : '미인증'}
              </Text>
              {myRecord ? (
                <Image source={checkIcon} style={styles.statusIcon} />
              ) : (
                <StatusFailIcon size={14} />
              )}
            </View>
          </View>
        </View>

        {/* 다른 멤버들 GitHub 인증 현황 */}
        {members
          .filter((m) => m.userId !== currentUserId)
          .map((member) => {
            const done = recordSet.has(`${member.userId}-${slot}-${date}`);
            return (
              <View key={member.userId} style={styles.row}>
                <Image source={profileImage} style={styles.avatar} />
                <View style={styles.content}>
                  <Text style={styles.name}>{displayName(member)} 님</Text>
                  <View style={styles.statusWrap}>
                    <Text
                      style={[
                        styles.statusText,
                        done ? styles.statusPass : styles.statusFail,
                      ]}
                    >
                      {done ? '완료' : '미인증'}
                    </Text>
                    {done ? (
                      <Image source={checkIcon} style={styles.statusIcon} />
                    ) : (
                      <StatusFailIcon size={14} />
                    )}
                  </View>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    marginTop: 8,
  },
  loadingWrap: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  myCard: {
    backgroundColor: colors.secondary,
    marginHorizontal: -25,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 21,
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusPass: {
    color: colors.primary,
  },
  statusFail: {
    color: '#E57373',
  },
  statusIcon: {
    width: 14,
    height: 14,
  },
});

export default StudyStatusGithub;
