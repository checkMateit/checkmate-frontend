import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import StudyStatusTabs from './StudyStatusTabs';
import StudyStatusSummary from './StudyStatusSummary';
import StudyStatusTodo from './StudyStatusTodo';
import StudyStatusGithub from './StudyStatusGithub';

type StudyStatusSectionProps = {
  resetKey: number;
};

function StudyStatusSection({ resetKey }: StudyStatusSectionProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'todo' | 'github'>('summary');

  useEffect(() => {
    setActiveTab('summary');
  }, [resetKey]);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{activeTab === 'summary' ? '이번주' : '오늘'}</Text>
        <StudyStatusTabs activeTab={activeTab} onChange={setActiveTab} />
      </View>
      {activeTab === 'summary' && <StudyStatusSummary />}
      {activeTab === 'todo' && <StudyStatusTodo />}
      {activeTab === 'github' && <StudyStatusGithub />}
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
