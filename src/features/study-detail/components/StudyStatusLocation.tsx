import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { colors } from '../../../styles/colors';
import {
  getGpsVerificationRecords,
  submitGpsVerification,
  getVerificationDateToday,
  getGpsRecordSubmittedAt,
  type GpsVerificationRecordRes,
} from '../../../api/verification';
import { getCurrentUserDisplayName, getCurrentUserId } from '../../../api/client';
import { fetchStudyGroupMembers } from '../../../api/studyGroups';
import type { StudyGroupMemberRes } from '../../../api/studyGroups';
import {
  isAfterTimeInKST,
  getDayIndexFromDate,
  BACKEND_DAY_CODES_BY_INDEX,
} from '../../../utils/timeKST';

const profileImage = require('../../../assets/icon/profile_1.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');
const locationIcon = require('../../../assets/icon/gps_icon.png');

function displayName(member: StudyGroupMemberRes): string {
  if (member.nickname?.trim()) return member.nickname.trim();
  if (member.role === 'Leader') return '방장';
  const short = member.userId.replace(/-/g, '').slice(-8);
  return short ? `…${short}` : '회원';
}

/** 표시용 이름: 이름만 표시, 없으면 '사용자 이름' */
function formatDisplayNameLabel(name: string): string {
  const n = (name ?? '').trim();
  if (!n || n === '회원') return '사용자 이름';
  return n;
}

type LocationSchedule = {
  endTime?: string;
  daysOfWeek?: string[];
};

type StudyStatusLocationProps = {
  groupId: string;
  slot: number;
  currentUserId: string | null;
  schedule?: LocationSchedule;
};

function StudyStatusLocation({
  groupId,
  slot,
  currentUserId,
  schedule,
}: StudyStatusLocationProps) {
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState<StudyGroupMemberRes[]>([]);
  const [records, setRecords] = useState<GpsVerificationRecordRes[]>([]);
  const [loading, setLoading] = useState(true);

  const date = getVerificationDateToday();
  const rawEnd = schedule?.endTime?.trim();
  const effectiveEnd =
    !rawEnd || rawEnd === '00:00' || rawEnd === '0:00' ? '23:59' : rawEnd;
  const deadlinePassed = isAfterTimeInKST(effectiveEnd);
  const todayDayIndex = getDayIndexFromDate(date);
  const todayDayCode = BACKEND_DAY_CODES_BY_INDEX[todayDayIndex];
  const isVerificationDayToday =
    (schedule?.daysOfWeek ?? []).includes(todayDayCode);

  const refresh = useCallback(() => {
    if (!groupId) return;
    setLoading(true);
    Promise.all([
      fetchStudyGroupMembers(groupId),
      getGpsVerificationRecords(groupId, slot, date).catch(() => ({
        data: { data: [] as GpsVerificationRecordRes[] },
      })),
    ])
      .then(([membersRes, recordsRes]) => {
        setMembers(Array.isArray(membersRes.data?.data) ? membersRes.data.data : []);
        const list =
          (recordsRes as { data?: { data?: GpsVerificationRecordRes[] } }).data?.data ?? [];
        setRecords(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        setMembers([]);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  }, [groupId, slot, date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        reject,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });

  /** Android: 런타임 위치 권한 요청. iOS는 Info.plist만 있으면 요청됨. */
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한',
          message:
            '위치 인증을 위해 이 앱이 위치 정보에 접근할 수 있도록 허용해 주세요.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  const showLocationPermissionAlert = () => {
    Alert.alert(
      '위치 인증',
      '위치 정보를 사용할 수 없습니다. 앱 설정에서 위치 권한을 허용해 주세요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '설정 열기',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  };

  const handleVerify = async () => {
    if (!isVerificationDayToday) {
      Alert.alert('안내', '오늘은 인증 요일이 아닙니다.', [{ text: '확인' }]);
      return;
    }
    if (deadlinePassed) {
      Alert.alert('마감됨', '인증 시간이 지났습니다.', [{ text: '확인' }]);
      return;
    }
    if (submitting) return;

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      showLocationPermissionAlert();
      return;
    }

    setSubmitting(true);
    getCurrentPosition()
      .then(({ latitude, longitude }) =>
        submitGpsVerification(groupId, slot, { latitude, longitude }, date),
      )
      .then(() => refresh())
      .catch((err) => {
        const code = err?.code;
        const msg =
          err?.response?.status === 400
            ? err?.response?.data?.message ?? '제출 시간이 지났거나 지정된 범위 밖이에요.'
            : '위치 인증 제출에 실패했어요.';
        if (code === 1 || code === 2 || code === 3) {
          showLocationPermissionAlert();
          return;
        }
        Alert.alert('인증 실패', msg);
      })
      .finally(() => setSubmitting(false));
  };

  const myRecord = records.find((r) => r.userId === currentUserId);
  const myMember = members.find((m) => m.userId === currentUserId);
  const myDisplayName =
    (myMember ? displayName(myMember) : null) ??
    (myRecord?.nickname?.trim() || null) ??
    getCurrentUserDisplayName();
  const isDone = Boolean(myRecord);
  const mySubmittedAt = myRecord ? getGpsRecordSubmittedAt(myRecord) : null;
  const myTime =
    mySubmittedAt != null
      ? new Date(mySubmittedAt).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '--:--';

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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {/* 나의 위치 인증 카드 */}
        <View style={[styles.row, styles.myCard]}>
          <Image source={profileImage} style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {formatDisplayNameLabel(myDisplayName)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.time}>{myTime}</Text>
              <View style={styles.statusWrap}>
                <Text
                  style={[
                    styles.statusText,
                    isDone ? styles.statusPass : styles.statusFail,
                  ]}
                >
                  {isDone ? '완료' : '미인증'}
                </Text>
                <Image
                  source={isDone ? checkIcon : cancelIcon}
                  style={[styles.statusIcon, !isDone && styles.statusIconFail]}
                />
              </View>
            </View>
          </View>
          {!isDone && (
            isVerificationDayToday && !deadlinePassed ? (
              <Pressable
                style={[styles.verifyButton, submitting && styles.verifyButtonDisabled]}
                onPress={handleVerify}
                disabled={submitting}
              >
                <Image source={locationIcon} style={styles.verifyIcon} />
                <Text style={styles.verifyText}>
                  {submitting ? '제출 중…' : '내 위치 인증'}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  if (!isVerificationDayToday) {
                    Alert.alert('안내', '오늘은 인증 요일이 아닙니다.', [
                      { text: '확인' },
                    ]);
                  } else {
                    Alert.alert('마감됨', '인증 시간이 지났습니다.', [
                      { text: '확인' },
                    ]);
                  }
                }}
              >
                <Text style={styles.deadlineText}>
                  {!isVerificationDayToday
                    ? '인증 요일 아님'
                    : '마감됨'}
                </Text>
              </Pressable>
            )
          )}
        </View>

        {/* 그룹원 위치 인증 현황 */}
        {members
          .filter((m) => m.userId !== currentUserId)
          .map((member) => {
            const record = records.find((r) => r.userId === member.userId);
            const done = Boolean(record);
            const otherSubmittedAt = record
              ? getGpsRecordSubmittedAt(record)
              : null;
            const time = otherSubmittedAt
              ? new Date(otherSubmittedAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : '--:--';
            return (
              <View key={member.userId} style={styles.row}>
                <Image source={profileImage} style={styles.avatar} />
                <View style={styles.content}>
                  <Text style={styles.name}>
                    {formatDisplayNameLabel(displayName(member))}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.time}>{time}</Text>
                    <View style={styles.statusWrap}>
                      <Text
                        style={[
                          styles.statusText,
                          done ? styles.statusPass : styles.statusFail,
                        ]}
                      >
                        {done ? '완료' : '미인증'}
                      </Text>
                      <Image
                        source={done ? checkIcon : cancelIcon}
                        style={[
                          styles.statusIcon,
                          !done && styles.statusIconFail,
                        ]}
                      />
                    </View>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 76,
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
    color: '#7D7D7D',
  },
  statusFail: {
    color: '#E53935',
  },
  statusIcon: {
    width: 14,
    height: 14,
  },
  statusIconFail: {
    tintColor: '#E53935',
  },
  deadlineText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F6F6F6',
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyIcon: {
    width: 13,
    height: 17,
    tintColor: colors.primary,
  },
  verifyText: {
    fontSize: 12,
    color: '#6F6F6F',
    fontWeight: '600',
  },
});

export default StudyStatusLocation;
