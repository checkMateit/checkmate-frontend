import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../../styles/colors';
import { submitPhotoVerification, getVerificationDateToday } from '../../../api/verification';
import { getCurrentUserDisplayName } from '../../../api/client';

const profileImage = require('../../../assets/icon/profile_1.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');
const vectorIcon = require('../../../assets/icon/sizeup_icon.png');
const closeIcon = require('../../../assets/icon/x_icon.png');

type StudyStatusPhotoProps = {
  groupId: string;
  slot: number;
};

function StudyStatusPhoto({ groupId, slot }: StudyStatusPhotoProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const openPreview = () => setPreviewVisible(true);
  const closePreview = () => setPreviewVisible(false);

  const handleVerify = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 10,
      },
      (res) => {
        if (res.didCancel || !res.assets?.length) return;
        const files = res.assets.map((a) => ({
          uri: a.uri ?? '',
          name: a.fileName ?? undefined,
          type: a.type ?? 'image/jpeg',
        })).filter((f) => f.uri);
        if (files.length === 0) {
          Alert.alert('사진을 선택해 주세요.');
          return;
        }
        setSubmitting(true);
        const date = getVerificationDateToday();
        submitPhotoVerification(groupId, slot, files, date)
          .then(() => {
            setSubmitted(true);
            if (files[0]?.uri) setPreviewUri(files[0].uri);
          })
          .catch((err) => {
            const msg =
              err?.response?.status === 400
                ? err?.response?.data?.message ?? '제출 시간이 지났거나 이미 제출했어요.'
                : '사진 인증 제출에 실패했어요.';
            Alert.alert('인증 실패', msg);
          })
          .finally(() => setSubmitting(false));
      },
    );
  };

  const displayName = getCurrentUserDisplayName();
  const isDone = submitted;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={profileImage} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{displayName} 님</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.time}>{isDone ? '제출 완료' : '--:--'}</Text>
            <View style={styles.statusWrap}>
              <Text
                style={[
                  styles.statusText,
                  !isDone && styles.statusFail,
                ]}
              >
                {isDone ? '완료' : '미인증'}
              </Text>
              <Image
                source={isDone ? checkIcon : cancelIcon}
                style={styles.statusIcon}
              />
            </View>
          </View>
        </View>
        {!isDone ? (
          <Pressable
            style={[styles.verifyButton, submitting && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            disabled={submitting}
          >
            <Text style={styles.verifyText}>
              {submitting ? '제출 중…' : '인증하기'}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.photoBox}>
            <Text style={styles.photoText}>사진</Text>
            <Pressable onPress={openPreview} hitSlop={6} style={styles.photoIconButton}>
              <Image source={vectorIcon} style={styles.photoIcon} />
            </Pressable>
          </View>
        )}
      </View>

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
              {previewUri ? (
                <Image
                  source={{ uri: previewUri }}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 21,
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 10,
    color: '#6E6E6E',
    fontWeight: '400',
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
    color: '#7D7D7D',
    fontWeight: '600',
  },
  statusIcon: {
    width: 14,
    height: 14,
  },
  statusFail: {
    color: '#7D7D7D',
  },
  verifyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F6F6F6',
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
    position: 'relative',
  },
  photoText: {
    fontSize: 12,
    color: '#8B8B8B',
  },
  photoIconButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
  photoIcon: {
    width: 8,
    height: 8,
    tintColor: '#969696',
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
