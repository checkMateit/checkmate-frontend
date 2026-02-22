import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

function StudyStatusLocation() {
  const [isVerified, setIsVerified] = useState(false);

  const rows = [
    {
      name: '라즈베리',
      time: isVerified ? '08:06 AM' : '--:--',
      status: {
        label: isVerified ? '착석 완료' : '미인증',
        tone: isVerified ? ('success' as const) : ('fail' as const),
      },
      editable: true,
    },
    {
      name: '단쌀말',
      time: '08:06 AM',
      status: { label: '완료', tone: 'success' as const },
      editable: false,
    },
    {
      name: 'LDK',
      time: '08:06 AM',
      status: { label: '완료', tone: 'success' as const },
      editable: false,
    },
    {
      name: '서윤호',
      time: '--:--',
      status: { label: '미인증', tone: 'fail' as const },
      editable: false,
    },
  ];

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
          {row.editable && row.status.tone === 'fail' ? (
            <Pressable style={styles.verifyButton} onPress={() => setIsVerified(true)}>
              <Image source={locationIcon} style={styles.verifyIcon} />
              <Text style={styles.verifyText}>내 위치 인증</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const profileImage = require('../../../assets/icon/profile_1.png');
const editIcon = require('../../../assets/icon/modify_icon.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');
const locationIcon = require('../../../assets/icon/gps_icon.png');

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 8,
    paddingBottom: 30,
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
