import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../styles/colors';
import StudyStatusTabs from './StudyStatusTabs';
import StudyStatusSummary from './StudyStatusSummary';
import StudyStatusTodo from './StudyStatusTodo';
import StudyStatusPhoto from './StudyStatusPhoto';

function StudyStatusSection() {
  const [activeTab, setActiveTab] = useState<'summary' | 'todo' | 'photo'>('summary');

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>이번주</Text>
        <StudyStatusTabs activeTab={activeTab} onChange={setActiveTab} />
      </View>
      {activeTab === 'summary' && <StudyStatusSummary />}
      {activeTab === 'todo' && <StudyStatusTodo />}
      {activeTab === 'photo' && <StudyStatusPhoto />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});

export default StudyStatusSection;
