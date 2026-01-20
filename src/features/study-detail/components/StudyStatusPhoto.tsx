import React, { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const profileImage = require('../../../assets/icon/profile_1.png');
const editIcon = require('../../../assets/icon/modify_icon.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');
const vectorIcon = require('../../../assets/icon/sizeup_icon.png');
const closeIcon = require('../../../assets/icon/x_icon.png');

const rows = [
  {
    name: '라즈베리',
    time: '--:--',
    status: { label: '미인증', tone: 'fail' as const },
    editable: true,
    hasPhoto: false,
  },
  {
    name: '단쌀말',
    time: '08:06 AM',
    status: { label: '완료', tone: 'success' as const },
    editable: false,
    hasPhoto: true,
  },
  {
    name: 'LDK',
    time: '08:06 AM',
    status: { label: '완료', tone: 'success' as const },
    editable: false,
    hasPhoto: true,
  },
  {
    name: '서윤호',
    time: '--:--',
    status: { label: '미인증', tone: 'fail' as const },
    editable: false,
    hasPhoto: false,
  },
];

function StudyStatusPhoto() {
  const [previewVisible, setPreviewVisible] = useState(false);

  const openPreview = () => setPreviewVisible(true);
  const closePreview = () => setPreviewVisible(false);

  return (
    <View style={styles.container}>
      {rows.map((row, index) => (
        <View key={`${row.name}-${index}`} style={styles.row}>
          <Image source={profileImage} style={styles.avatar} />
          <View style={styles.content}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{row.name} 님</Text>
              {row.editable && <Image source={editIcon} style={styles.editIcon} />}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.time}>{row.time}</Text>
              <View style={styles.statusWrap}>
                <Text style={[styles.statusText, row.status.tone === 'fail' && styles.statusFail]}>
                  {row.status.label}
                </Text>
                <Image
                  source={row.status.tone === 'fail' ? cancelIcon : checkIcon}
                  style={styles.statusIcon}
                />
              </View>
            </View>
          </View>
          {row.status.tone === 'fail' ? (
            <Pressable style={styles.verifyButton}>
              <Text style={styles.verifyText}>인증하기</Text>
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
      ))}
      <Modal visible={previewVisible} transparent animationType="fade" onRequestClose={closePreview}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Pressable style={styles.modalClose} onPress={closePreview} hitSlop={6}>
              <Image source={closeIcon} style={styles.closeIcon} />
            </Pressable>
            <View style={styles.modalImage}>
              <Text style={styles.modalImageText}>사진</Text>
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
  editIcon: {
    width: 8,
    height: 9,
    tintColor: '#7D7D7D',
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
  statusFail: {
    color: '#7D7D7D',
  },
  statusIcon: {
    width: 11,
    height: 11,
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
  verifyButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F6F6F6',
  },
  verifyText: {
    fontSize: 12,
    color: '#6F6F6F',
    fontWeight: '600',
  },
  photoPlaceholder: {
    width: 62,
    height: 62,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
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
  },
  modalImageText: {
    fontSize: 14,
    color: '#8B8B8B',
  },
});

export default StudyStatusPhoto;
