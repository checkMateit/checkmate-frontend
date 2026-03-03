import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';
import {
  fetchStudyGroupMembers,
  fetchVerificationRecords,
  type StudyGroupMemberRes,
  type VerificationRecordItemRes,
} from '../../../api/studyGroups';
import { getTodayDateString } from '../../../utils/timeKST';

const profileImage = require('../../../assets/icon/profile_1.png');
const profileImage2 = require('../../../assets/icon/profile_2.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];
/** JS getDay(): 일=0, 월=1, ... 토=6 → 백엔드 MON=월=1, TUE=2, ..., SUN=0. 우리 인덱스: 월=0, ..., 일=6 */
const BACKEND_DAY_CODES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const METHOD_LABEL: Record<string, string> = {
  PHOTO: '사진',
  CHECKLIST: 'TODO',
  GPS: '위치',
  GITHUB: 'GitHub',
};

function getThisWeekMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 7 : day) + 1;
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);
  const y = monday.getFullYear();
  const m = (monday.getMonth() + 1).toString().padStart(2, '0');
  const dayNum = monday.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${dayNum}`;
}

function getWeekDates(): string[] {
  const mondayStr = getThisWeekMonday();
  const [y, m, day] = mondayStr.split('-').map(Number);
  const base = new Date(y, m - 1, day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    const yy = d.getFullYear();
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  });
}

function getDayIndexFromDate(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  return day === 0 ? 6 : day - 1;
}

export type VerificationRuleForSummary = {
  slot: number;
  methodCode: string;
  daysOfWeek?: string[];
};

type StudyStatusSummaryProps = {
  groupId: string;
  currentUserId: string | null;
  verificationRules: VerificationRuleForSummary[];
  methods: string[];
};

function StudyStatusSummary({
  groupId,
  currentUserId,
  verificationRules,
  methods,
}: StudyStatusSummaryProps) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<StudyGroupMemberRes[]>([]);
  const [records, setRecords] = useState<VerificationRecordItemRes[]>([]);

  const loadData = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const startDate = getThisWeekMonday();
      const endDate = getTodayDateString();
      const [membersRes, recordsRes] = await Promise.all([
        fetchStudyGroupMembers(groupId),
        fetchVerificationRecords(groupId, { startDate, endDate }),
      ]);
      const memberList = (membersRes.data?.data ?? []).filter(
        (m) => m.status === 'ACTIVE',
      );
      setMembers(memberList);
      setRecords(recordsRes.data?.data?.records ?? []);
    } catch {
      setMembers([]);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const weekDates = useMemo(() => getWeekDates(), []);
  const recordSet = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      set.add(`${r.userId}-${r.slot}-${r.verificationDate}`);
    });
    return set;
  }, [records]);

  const authDayIndices = useMemo(() => {
    const indices = new Set<number>();
    verificationRules.forEach((r) => {
      (r.daysOfWeek ?? []).forEach((code) => {
        const idx = BACKEND_DAY_CODES.indexOf(code);
        if (idx >= 0) {
          indices.add(idx === 0 ? 6 : idx - 1);
        }
      });
    });
    return indices;
  }, [verificationRules]);

  const slotOrder = useMemo(() => {
    return verificationRules
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((r) => ({ slot: r.slot, methodCode: r.methodCode }));
  }, [verificationRules]);

  const legendMethods = useMemo(() => {
    if (methods.length > 0) return methods.slice(0, 2);
    return slotOrder.map((s) => METHOD_LABEL[s.methodCode] ?? s.methodCode).slice(0, 2);
  }, [methods, slotOrder]);

  const requiredSlotsForDate = useCallback(
    (dateStr: string): number[] => {
      const dayIndex = getDayIndexFromDate(dateStr);
      const dayLabel = DAY_LABELS[dayIndex];
      const backendCode = dayIndex === 6 ? 'SUN' : BACKEND_DAY_CODES[dayIndex + 1];
      return verificationRules
        .filter((r) => (r.daysOfWeek ?? []).includes(backendCode))
        .map((r) => r.slot);
    },
    [verificationRules],
  );

  const todayStr = useMemo(() => getTodayDateString(), []);
  const todayRequiredSlots = useMemo(
    () => requiredSlotsForDate(todayStr),
    [todayStr, requiredSlotsForDate],
  );

  const rows = useMemo(() => {
    return members.map((member) => {
      const nickname = member.nickname?.trim() || '회원';
      const isSelf = currentUserId != null && member.userId === currentUserId;
      const dotsPerDay = weekDates.map((dateStr) => {
        const slotsVerified = slotOrder.filter(({ slot }) =>
          recordSet.has(`${member.userId}-${slot}-${dateStr}`),
        );
        return slotsVerified.map(({ slot }) => {
          const idx = slotOrder.findIndex((s) => s.slot === slot);
          return idx === 0 ? 'primary' : 'secondary';
        });
      });
      const hasTodayComplete =
        todayRequiredSlots.length === 0 ||
        todayRequiredSlots.every((slot) =>
          recordSet.has(`${member.userId}-${slot}-${todayStr}`),
        );
      return {
        userId: member.userId,
        name: nickname,
        isSelf,
        dotsPerDay,
        status: hasTodayComplete ? { label: '완료', tone: 'success' as const } : { label: '미인증', tone: 'fail' as const },
      };
    });
  }, [
    members,
    currentUserId,
    weekDates,
    slotOrder,
    recordSet,
    todayStr,
    todayRequiredSlots,
  ]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingWrap]}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>이번 주 인증 현황 불러오는 중…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.legendRow}>
        {legendMethods.map((method, index) => (
          <View key={`${method}-${index}`} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                index === 0 ? styles.primaryDot : styles.secondaryDot,
              ]}
            />
            <Text style={styles.legendText}>{method}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysHeaderRow}>
        <View style={styles.avatarSpacer} />
        <View style={styles.daysRow}>
          {DAY_LABELS.map((day, idx) => (
            <View key={day} style={styles.dayCell}>
              <Text
                style={[
                  styles.dayLabel,
                  authDayIndices.has(idx) && styles.dayLabelActive,
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.statusSpacer} />
      </View>

      {rows.map((row, index) => (
        <View key={row.userId} style={styles.row}>
          <View style={styles.avatarCol}>
            <Image
              source={index % 2 === 0 ? profileImage : profileImage2}
              style={styles.avatar}
            />
            <Text style={[styles.name, row.isSelf && styles.nameSelf]}>
              {row.name}
            </Text>
          </View>
          <View style={styles.daysRow}>
            {row.dotsPerDay.map((dotList, dayIdx) => (
              <View key={dayIdx} style={styles.dayCell}>
                {dotList.length === 0 ? (
                  <View style={[styles.dayDot, styles.emptyDot]} />
                ) : dotList.length === 1 ? (
                  <View
                    style={[
                      styles.dayDot,
                      dotList[0] === 'primary' && styles.primaryDot,
                      dotList[0] === 'secondary' && styles.secondaryDot,
                    ]}
                  />
                ) : (
                  <View style={styles.dayDotStack}>
                    {dotList.map((dot, dotIndex) => (
                      <View
                        key={`${dayIdx}-${dotIndex}`}
                        style={[
                          styles.dayDot,
                          styles.dayDotStackItem,
                          dotIndex === 1 && styles.dayDotStackSecond,
                          dot === 'primary' && styles.primaryDot,
                          dot === 'secondary' && styles.secondaryDot,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
          <View style={styles.statusCol}>
            <Text
              style={[
                styles.status,
                row.status.tone === 'fail' && styles.statusFail,
              ]}
            >
              {row.status.label}
            </Text>
            <Image
              source={row.status.tone === 'fail' ? cancelIcon : checkIcon}
              style={styles.statusIcon}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingBottom: 16,
  },
  loadingWrap: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  legendItem: {
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarSpacer: {
    width: 78,
  },
  statusSpacer: {
    width: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  avatarCol: {
    width: 78,
    alignItems: 'flex-start',
    gap: 4,
    marginTop: -4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 21,
  },
  name: {
    fontSize: 10,
    fontWeight: '300',
    color: colors.textSecondary,
  },
  nameSelf: {
    color: colors.primary,
    fontWeight: '600',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 11,
    color: '#111111',
    fontWeight: '500',
  },
  dayLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  dayDot: {
    width: 17,
    height: 17,
    borderRadius: 10,
  },
  dayCell: {
    width: 28,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDotStack: {
    width: 25,
    height: 17,
    position: 'relative',
  },
  dayDotStackItem: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dayDotStackSecond: {
    left: 8,
  },
  primaryDot: {
    backgroundColor: colors.primary,
  },
  secondaryDot: {
    backgroundColor: '#7E72FD',
  },
  emptyDot: {
    backgroundColor: 'transparent',
  },
  statusCol: {
    marginLeft: 'auto',
    width: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  status: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  statusFail: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '600',
  },
  statusIcon: {
    width: 11,
    height: 11,
  },
});

export default StudyStatusSummary;
