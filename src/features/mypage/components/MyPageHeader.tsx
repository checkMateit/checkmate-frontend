import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const alarmIcon = require('../../../assets/icon/alarm_icon.png');
const settingIcon = require('../../../assets/icon/setting_icon.png');

type MyPageHeaderProps = {
  onPressAlarm?: () => void;
  onPressSetting?: () => void;
  alarmSize?: { width: number; height: number };
  settingSize?: { width: number; height: number };
};

function MyPageHeader({
  onPressAlarm,
  onPressSetting,
  alarmSize = { width: 22.28, height: 28},
  settingSize = { width: 25, height: 25 },
}: MyPageHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>
      <View style={styles.iconRow}>
        <Pressable onPress={onPressAlarm} style={styles.iconButton}>
          <Image source={alarmIcon} style={[styles.icon, alarmSize]} />
        </Pressable>
        <Pressable onPress={onPressSetting} style={styles.iconButton}>
          <Image source={settingIcon} style={[styles.icon, settingSize]} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  icon: {
    tintColor: '#9B9B9B',
  },
});

export default MyPageHeader;
