import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

function StudyStatusPhoto() {
  return (
    <View style={styles.container}>
      {['라즈베리', '단쌀말', 'LDK', '서윤호'].map((name, index) => (
        <View key={`${name}-${index}`} style={styles.row}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.name}>{name} 님</Text>
            <Text style={styles.photoTitle}>백준 20001번</Text>
          </View>
          <View style={styles.statusWrap}>
            <Text style={styles.statusText}>완료</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DFF4FF',
    marginRight: 10,
  },
  name: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusWrap: {
    marginLeft: 'auto',
  },
  statusText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default StudyStatusPhoto;
