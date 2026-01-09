import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

function StudyStatusSummary() {
  return (
    <View style={styles.container}>
      <View style={styles.legend}>
        <View style={[styles.legendDot, { backgroundColor: '#7B6CFF' }]} />
        <Text style={styles.legendText}>TODO</Text>
        <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
        <Text style={styles.legendText}>사진</Text>
      </View>

      {['라즈베리 님', '라즈베리 님', '라즈베리 님', '라즈베리 님'].map((name, index) => (
        <View key={`${name}-${index}`} style={styles.row}>
          <View style={styles.avatar} />
          <View style={styles.daysRow}>
            {['월', '화', '수', '목'].map((day, idx) => (
              <View key={`${day}-${idx}`} style={styles.dayDot} />
            ))}
          </View>
          <Text style={styles.status}>완료</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DFF4FF',
    marginRight: 10,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
  },
  status: {
    marginLeft: 'auto',
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default StudyStatusSummary;
