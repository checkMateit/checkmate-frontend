import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

function StudyStatusLocation() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>위치 인증</Text>
      <Text style={styles.subtitle}>위치 인증 기록이 여기에 표시됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default StudyStatusLocation;
