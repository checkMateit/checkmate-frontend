import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../styles/colors';

function StudyStatusTodo() {
  return (
    <View style={styles.container}>
      <View style={styles.todoCard}>
        <Text style={styles.todoTitle}>나의 TODO</Text>
        <View style={styles.todoRow}>
          <View style={styles.check} />
          <Text style={styles.todoText}>영단어 10개 외우기</Text>
        </View>
        <View style={styles.todoRow}>
          <View style={styles.check} />
          <Text style={styles.todoText}>영단어 10개 외우기</Text>
        </View>
        <View style={styles.todoRow}>
          <View style={styles.check} />
          <Text style={styles.todoText}>영단어 10개 외우기</Text>
        </View>
        <Text style={styles.addText}>+ 추가하기</Text>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.todoSmall}>
          <Text style={styles.smallName}>라즈베리님</Text>
          <View style={styles.todoRow}>
            <View style={styles.check} />
            <Text style={styles.todoText}>영단어 10개 외우기</Text>
          </View>
        </View>
        <View style={styles.todoSmall}>
          <Text style={styles.smallName}>단쌀말님</Text>
          <View style={styles.todoRow}>
            <View style={styles.check} />
            <Text style={styles.todoText}>영단어 10개 외우기</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  todoCard: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  check: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#C8C8C8',
  },
  todoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  todoSmall: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    padding: 12,
  },
  smallName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
});

export default StudyStatusTodo;
