import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../styles/colors';

type StatusTab = 'summary' | 'todo' | 'photo';

type StudyStatusTabsProps = {
  activeTab: StatusTab;
  onChange: (tab: StatusTab) => void;
};

function StudyStatusTabs({ activeTab, onChange }: StudyStatusTabsProps) {
  return (
    <View style={styles.row}>
      {[
        { key: 'summary', label: '요약' },
        { key: 'todo', label: 'TODO' },
        { key: 'photo', label: '사진' },
      ].map((tab) => (
        <Pressable
          key={tab.key}
          style={[styles.chip, activeTab === tab.key && styles.chipActive]}
          onPress={() => onChange(tab.key as StatusTab)}
        >
          <Text style={[styles.chipText, activeTab === tab.key && styles.chipTextActive]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});

export default StudyStatusTabs;
