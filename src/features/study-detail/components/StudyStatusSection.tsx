import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import StudyStatusTabs from './StudyStatusTabs';
import StudyStatusSummary from './StudyStatusSummary';
import StudyStatusTodo from './StudyStatusTodo';
import StudyStatusPhoto from './StudyStatusPhoto';
import StudyStatusGithub from './StudyStatusGithub';
import StudyStatusLocation from './StudyStatusLocation';

type StudyStatusSectionProps = {
  resetKey: number;
  methods: string[];
};

const getAvailableTabs = (methods: string[]) => {
  const normalized = methods.map((method) => method.toLowerCase());
  const hasTodo = normalized.some((method) => method.includes('todo'));
  const hasPhoto = normalized.some(
    (method) => method.includes('사진') || method.includes('photo'),
  );
  const hasGithub = normalized.some((method) => method.includes('github'));
  const hasLocation = normalized.some(
    (method) => method.includes('gps') || method.includes('위치'),
  );
  return [
    'summary',
    ...(hasTodo ? ['todo'] : []),
    ...(hasPhoto ? ['photo'] : []),
    ...(hasGithub ? ['github'] : []),
    ...(hasLocation ? ['location'] : []),
  ] as Array<'summary' | 'todo' | 'photo' | 'github' | 'location'>;
};

function StudyStatusSection({ resetKey, methods }: StudyStatusSectionProps) {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'todo' | 'photo' | 'github' | 'location'
  >('summary');
  const availableTabs = useMemo(() => getAvailableTabs(methods), [methods]);

  useEffect(() => {
    setActiveTab(availableTabs[0] ?? 'summary');
  }, [resetKey, availableTabs]);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>
          {activeTab === 'todo' ? '오늘' : '이번주'}
        </Text>
        <StudyStatusTabs activeTab={activeTab} onChange={setActiveTab} methods={methods} />
      </View>
      {activeTab === 'summary' && <StudyStatusSummary methods={methods} />}
      {activeTab === 'todo' && <StudyStatusTodo />}
      {activeTab === 'photo' && <StudyStatusPhoto />}
      {activeTab === 'github' && <StudyStatusGithub />}
      {activeTab === 'location' && <StudyStatusLocation />}
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
