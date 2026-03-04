import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../../styles/colors';
import {
  submitPhotoVerification,
  getVerificationDateToday,
  getPhotoVerificationRecords,
  situationFromFilePath,
  getVerificationPhotoUrl,
  getRecordSubmittedAt,
  type PhotoVerificationRecordRes,
} from '../../../api/verification';
import { getCurrentUserDisplayName, getCurrentUserId } from '../../../api/client';
import { fetchStudyGroupMembers } from '../../../api/studyGroups';
import type { StudyGroupMemberRes } from '../../../api/studyGroups';
import { isAfterTimeInKST } from '../../../utils/timeKST';
import StatusFailIcon from '../../../components/common/StatusFailIcon';

const profileImage = require('../../../assets/icon/profile_1.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const vectorIcon = require('../../../assets/icon/sizeup_icon.png');
const closeIcon = require('../../../assets/icon/x_icon.png');

function displayName(member: StudyGroupMemberRes): string {
  if (member.nickname?.trim()) return member.nickname.trim();
  if (member.role === 'Leader') return '방장';
  const short = member.userId.replace(/-/g, '').slice(-8);
  return short ? `…${short}` : '회원';
}

/** 기록에서 상황 목록 추출 (업로드한 사진 제목 = 상황). 파일명이 UUID면 비어 있음. */
function getSituations(record: PhotoVerificationRecordRes): string[] {
  const raw = record.titles?.length
    ? record.titles
    : (record.filePaths ?? []).map(situationFromFilePath);
  return raw.filter((s) => !isUuidLikeSituation(s));
}

/** 저장용 UUID 파일명 등 의미 없는 '상황'이면 true (표시 생략) */
function isUuidLikeSituation(s: string): boolean {
  const t = (s ?? '').trim();
  if (!t) return true;
  if (t.length < 10) return false;
  return /^[0-9a-f-]{10,}$/i.test(t) || /^[0-9a-f]{10,}$/i.test(t);
}

type PhotoSchedule = { endTime?: string };

type StudyStatusPhotoProps = {
  groupId: string;
  slot: number;
  schedule?: PhotoSchedule;
};

function StudyStatusPhoto({ groupId, slot, schedule }: StudyStatusPhotoProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  /** 업로드 직후 썸네일용 로컬 URI (새로고침 전까지 사용) */
  const [localThumbUri, setLocalThumbUri] = useState<string | null>(null);
  const [members, setMembers] = useState<StudyGroupMemberRes[]>([]);
  const [records, setRecords] = useState<PhotoVerificationRecordRes[]>([]);
  const [loading, setLoading] = useState(true);

  const date = getVerificationDateToday();
  const currentUserId = getCurrentUserId();
  // endTime이 없거나 "00:00"이면 당일 마감 없는 것으로 보고, 23:59로 두어 인증 버튼 활성화 유지
  const rawEnd = schedule?.endTime?.trim();
  const effectiveEnd =
    !rawEnd || rawEnd === '00:00' || rawEnd === '0:00' ? '23:59' : rawEnd;
  const deadlinePassed = isAfterTimeInKST(effectiveEnd);

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetchStudyGroupMembers(groupId),
      getPhotoVerificationRecords(groupId, slot, date).catch(() => ({ data: { data: [] as PhotoVerificationRecordRes[] } })),
    ])
      .then(([membersRes, recordsRes]) => {
        const ok =
          membersRes.data &&
          ((membersRes.data as { isSuccess?: boolean }).isSuccess === true ||
            (membersRes.data as { success?: boolean }).success === true);
        setMembers(Array.isArray(membersRes.data?.data) ? membersRes.data.data : []);
        const list = (recordsRes as { data?: { data?: PhotoVerificationRecordRes[] } }).data?.data ?? [];
        setRecords(Array.isArray(list) ? list : []);
        const myRecord = list.find((r: PhotoVerificationRecordRes) => r.userId === currentUserId);
        if (myRecord) setSubmitted(true);
      })
      .catch(() => {
        setMembers([]);
        setRecords([]);
      })
      .finally(() => setLoading(false));
  }, [groupId, slot, date, currentUserId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openPreview = () => setPreviewVisible(true);
  const closePreview = () => setPreviewVisible(false);

  const openGalleryAndSubmit = async () => {
    if (submitting) return;
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 10,
        quality: 0.8,
      });
      if (res.didCancel || !res.assets?.length) return;
      const files = res.assets
        .map((a) => ({
          uri: a.uri ?? '',
          name: a.fileName ?? undefined,
          type: a.type ?? 'image/jpeg',
        }))
        .filter((f) => f.uri);
      if (files.length === 0) {
        Alert.alert('사진을 선택해 주세요.');
        return;
      }
      setSubmitting(true);
      try {
        await submitPhotoVerification(groupId, slot, files, date);
        setSubmitted(true);
        if (files[0]?.uri) {
          setPreviewUri(files[0].uri);
          setLocalThumbUri(files[0].uri);
        }
        refresh();
      } catch (err: unknown) {
        const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
        const status = res?.status;
        const serverMsg = res?.data?.message;
        const msg =
          status === 400
            ? serverMsg ?? '제출 시간이 지났거나 이미 제출했어요.'
            : serverMsg
              ? `(${status ?? '오류'}) ${serverMsg}`
              : status === 404
                ? '사진 인증 규칙을 찾을 수 없어요. (404)'
                : status === 403
                  ? '권한이 없어요. (403)'
                  : status != null
                    ? `서버 오류 (${status}). ${serverMsg ?? ''}`.trim()
                    : '사진 인증 제출에 실패했어요. (네트워크 또는 서버 확인)';
        Alert.alert('인증 실패', msg);
      } finally {
        setSubmitting(false);
      }
    } catch (_err) {
      Alert.alert('오류', '사진첩을 열 수 없습니다. 권한을 확인해 주세요.');
    }
  };

  const handleVerify = () => {
    if (deadlinePassed) {
      Alert.alert(
        '마감됨',
        '인증 마감 시각이 지나 업로드할 수 없습니다.',
        [{ text: '확인' }],
      );
      return;
    }
    if (submitting) return;
    Alert.alert('사진 인증', '사진을 선택해 주세요.', [
      { text: '취소', style: 'cancel' },
      { text: '갤러리에서 선택', onPress: openGalleryAndSubmit },
    ]);
  };

  const myRecord = records.find((r) => r.userId === currentUserId);
  /** 멤버 목록/인증 기록의 닉네임 사용 (getCurrentUserDisplayName은 미설정 시 '회원') */
  const myMember = members.find((m) => m.userId === currentUserId);
  const myDisplayName =
    (myMember ? displayName(myMember) : null) ??
    (myRecord?.nickname?.trim() || null) ??
    getCurrentUserDisplayName();
  const isDone = submitted || Boolean(myRecord);
  const mySubmittedAt = myRecord ? getRecordSubmittedAt(myRecord) : null;
  const myTime =
    mySubmittedAt != null
      ? new Date(mySubmittedAt).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : '--:--';
  const mySituations = myRecord ? getSituations(myRecord) : [];
  /** 내 썸네일 표시용 URI: 로컬 업로드 직후 → 서버 filePaths 첫 번째 */
  const myThumbnailUri =
    localThumbUri ||
    (myRecord?.filePaths?.[0] ? getVerificationPhotoUrl(myRecord.filePaths[0]) : null);

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
        {/* 나의 사진 인증 카드 */}
        <View style={[styles.row, styles.myCard]}>
          <Image source={profileImage} style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{myDisplayName} 님</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.time}>{myTime}</Text>
              <View style={styles.statusWrap}>
                <Text style={[styles.statusText, isDone ? styles.statusPass : styles.statusFail]}>
                  {isDone ? '완료' : '미인증'}
                </Text>
                {isDone ? (
                  <Image source={checkIcon} style={styles.statusIcon} />
                ) : (
                  <StatusFailIcon size={14} />
                )}
              </View>
            </View>
            {mySituations.length > 0 && (
              <Text style={styles.situationLabel} numberOfLines={2}>
                상황: {mySituations.join(', ')}
              </Text>
            )}
          </View>
          {!isDone ? (
            deadlinePassed ? (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    '마감됨',
                    '인증 마감 시각이 지나 업로드할 수 없습니다.',
                    [{ text: '확인' }],
                  )
                }
                activeOpacity={0.7}
              >
                <Text style={styles.deadlineText}>마감됨</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.verifyButton, submitting && styles.verifyButtonDisabled]}
                onPress={handleVerify}
                disabled={submitting}
                activeOpacity={0.7}
              >
                <Text style={styles.verifyText}>
                  {submitting ? '제출 중…' : '인증하기'}
                </Text>
              </TouchableOpacity>
            )
          ) : (
            <Pressable
              onPress={() => {
                if (myThumbnailUri) setPreviewUri(myThumbnailUri);
                openPreview();
              }}
              style={styles.thumbnailWrap}
            >
              {myThumbnailUri ? (
                <Image
                  source={{ uri: myThumbnailUri }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.photoBox}>
                  <Text style={styles.photoText}>사진</Text>
                  <Image source={vectorIcon} style={styles.photoIcon} />
                </View>
              )}
            </Pressable>
          )}
        </View>

        {/* 다른 멤버들 사진 인증 현황 (상황 = 사진 제목) */}
        {members
          .filter((m) => m.userId !== currentUserId)
          .map((member) => {
            const record = records.find((r) => r.userId === member.userId);
            const done = Boolean(record);
            const otherSubmittedAt = record ? getRecordSubmittedAt(record) : null;
            const time = otherSubmittedAt
              ? new Date(otherSubmittedAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : '--:--';
            const situations = record ? getSituations(record) : [];
            const otherThumbnailUri = record?.filePaths?.[0]
              ? getVerificationPhotoUrl(record.filePaths[0])
              : null;
            return (
              <View key={member.userId} style={styles.row}>
                <Image source={profileImage} style={styles.avatar} />
                <View style={styles.content}>
                  <Text style={styles.name}>{displayName(member)} 님</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.time}>{time}</Text>
                    <View style={styles.statusWrap}>
                      <Text style={[styles.statusText, done ? styles.statusPass : styles.statusFail]}>
                        {done ? '완료' : '미인증'}
                      </Text>
                      {done ? (
                        <Image source={checkIcon} style={styles.statusIcon} />
                      ) : (
                        <StatusFailIcon size={14} />
                      )}
                    </View>
                  </View>
                  {situations.length > 0 && (
                    <Text style={styles.situationLabel} numberOfLines={2}>
                      상황: {situations.join(', ')}
                    </Text>
                  )}
                </View>
                {done ? (
                  <Pressable
                    onPress={() => {
                      if (otherThumbnailUri) {
                        setPreviewUri(otherThumbnailUri);
                        openPreview();
                      }
                    }}
                    style={styles.thumbnailWrap}
                  >
                    {otherThumbnailUri ? (
                      <Image
                        source={{ uri: otherThumbnailUri }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.photoBox}>
                        <Text style={styles.photoText}>사진</Text>
                        <Image source={vectorIcon} style={styles.photoIcon} />
                      </View>
                    )}
                  </Pressable>
                ) : (
                  <View style={styles.thumbnailWrap}>
                    <View style={styles.photoBox}>
                      <Text style={styles.photoText}>사진</Text>
                      <Image source={vectorIcon} style={styles.photoIcon} />
                    </View>
                  </View>
                )}
              </View>
            );
          })}
      </ScrollView>

      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Pressable style={styles.modalClose} onPress={closePreview} hitSlop={6}>
              <Image source={closeIcon} style={styles.closeIcon} />
            </Pressable>
            <View style={styles.modalImage}>
              {(previewUri || myThumbnailUri) ? (
                <Image
                  source={{ uri: (previewUri || myThumbnailUri) ?? '' }}
                  style={styles.modalImageImg}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.modalImageText}>사진</Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
  statusIcon: {
    width: 14,
    height: 14,
  },
  statusFail: {
    color: '#E57373',
  },
  deadlineText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  thumbnailWrap: {
    width: 62,
    height: 62,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  situationLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusIcon: {
    width: 11,
    height: 11,
  },
  verifyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F6F6F6',
    flexShrink: 0,
    minWidth: 72,
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyText: {
    fontSize: 12,
    color: '#6F6F6F',
    fontWeight: '600',
  },
  photoBox: {
    width: 62,
    height: 62,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 12,
    color: '#8B8B8B',
  },
  photoIcon: {
    width: 8,
    height: 8,
    tintColor: '#969696',
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  modalClose: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    width: 18,
    height: 18,
    tintColor: '#7D7D7D',
  },
  modalImage: {
    width: 240,
    height: 240,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    overflow: 'hidden',
  },
  modalImageImg: {
    width: '100%',
    height: '100%',
  },
  modalImageText: {
    fontSize: 14,
    color: '#8B8B8B',
  },
});

export default StudyStatusPhoto;
