import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import StudyBoardTab from '../components/StudyBoard/StudyBoardTab';
import StudyDetailHeader from '../components/StudyDetail/StudyDetailHeader';
import StudyDetailTabs from '../components/StudyDetail/StudyDetailTabs';
import StudyInfoTab from '../components/StudyDetail/StudyInfoTab';
import StudyOverviewCard from '../components/StudyDetail/StudyOverviewCard';
import StudyReportTab from '../components/StudyReport/StudyReportTab';
import StudyStatusSection from '../components/StudyDetail/StudyStatusSection';
import { colors } from '../styles/colors';

export type StudyDetail = {
  id: string;
  tag: string;
  title: string;
  members: string;
  description: string;
  schedule: string;
  count: string;
  methods: string[];
  image: number;
  statusText: string;
  statusVariant: 'success' | 'danger' | 'neutral';
  statusIcons: Array<'success' | 'danger'>;
  mascotSource: number;
};

type StudyDetailScreenProps = {
  study: StudyDetail;
  onClose: () => void;
};

function StudyDetailScreen({ study, onClose }: StudyDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'report' | 'board' | 'info'>('status');
  const [statusResetKey, setStatusResetKey] = useState(0);

  const handleTabChange = (tab: 'status' | 'report' | 'board' | 'info') => {
    setActiveTab(tab);
    if (tab === 'status') {
      setStatusResetKey((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StudyDetailHeader title="내 스터디" onClose={onClose} />
        <StudyOverviewCard
          tag={study.tag}
          title={study.title}
          members={study.members}
          description={study.description}
          schedule={study.schedule}
          count={study.count}
          methods={study.methods}
          image={study.image}
        />
        <StudyDetailTabs activeTab={activeTab} onChange={handleTabChange} />
        <View style={styles.section}>
          {activeTab === 'status' && <StudyStatusSection resetKey={statusResetKey} />}
          {activeTab === 'report' && <StudyReportTab />}
          {activeTab === 'board' && <StudyBoardTab />}
          {activeTab === 'info' && <StudyInfoTab />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingTop: 6,
  },
});

export default StudyDetailScreen;
