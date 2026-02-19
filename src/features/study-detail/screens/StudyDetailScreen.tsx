import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import StudyBoardTab from '../../study-board/components/StudyBoardTab';
import StudyDetailHeader from '../components/StudyDetailHeader';
import StudyDetailTabs from '../components/StudyDetailTabs';
import StudyInfoTab from '../components/StudyInfoTab';
import StudyOverviewCard from '../components/StudyOverviewCard';
import StudyReportTab from '../../study-report/components/StudyReportTab';
import StudyStatusSection from '../components/StudyStatusSection';
import { colors } from '../../../styles/colors';
import { type HomeStackParamList } from '../../../navigation/types';

export type StudyDetail = {
  id: string;
  tag: string;
  title: string;
  members: string;
  description: string;
  schedule: string;
  count: string;
  methods: string[];
  image: ImageSourcePropType;
  statusText: string;
  statusVariant: 'success' | 'danger' | 'neutral';
  statusIcons: Array<'success' | 'danger'>;
  mascotSource: number;
  authTimeLabel?: string;
  authTime?: string;
  authTimeLabel2?: string;
  authTime2?: string;
  authDays?: string;
  period?: string;
};

type StudyDetailScreenProps = {
  study?: StudyDetail;
  onClose?: () => void;
};

function StudyDetailScreen({ study: studyProp, onClose }: StudyDetailScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, 'StudyDetail'>>();
  const resolvedStudy = useMemo(
    () => studyProp ?? route.params?.study,
    [route.params, studyProp],
  );
  const [activeTab, setActiveTab] = useState<'status' | 'report' | 'board' | 'info'>('status');
  const [statusResetKey, setStatusResetKey] = useState(0);

  if (!resolvedStudy) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.fallback}>
          <View style={styles.fallbackCard}>
            <View style={styles.fallbackTitle} />
            <View style={styles.fallbackLine} />
            <View style={styles.fallbackLine} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleTabChange = (tab: 'status' | 'report' | 'board' | 'info') => {
    setActiveTab(tab);
    if (tab === 'status') {
      setStatusResetKey((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StudyDetailHeader title="내 스터디" onClose={onClose ?? navigation.goBack} />
        <StudyOverviewCard
          tag={resolvedStudy.tag}
          title={resolvedStudy.title}
          members={resolvedStudy.members}
          description={resolvedStudy.description}
          schedule={resolvedStudy.schedule}
          methods={resolvedStudy.methods}
          image={resolvedStudy.image}
          authTime={resolvedStudy.authTime}
          authTime2={resolvedStudy.authTime2}
        />
        <StudyDetailTabs activeTab={activeTab} onChange={handleTabChange} />
        <View style={styles.section}>
          {activeTab === 'status' && (
            <StudyStatusSection resetKey={statusResetKey} methods={resolvedStudy.methods} />
          )}
          {activeTab === 'report' && <StudyReportTab />}
          {activeTab === 'board' && <StudyBoardTab studyName={resolvedStudy.title} />}
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
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fallbackCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  fallbackTitle: {
    height: 18,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
  },
  fallbackLine: {
    height: 12,
    backgroundColor: '#E6E6E6',
    borderRadius: 6,
  },
});

export default StudyDetailScreen;
