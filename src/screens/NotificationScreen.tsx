import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import NotificationHeader from '../features/notification/components/NotificationHeader';
import NotificationNoticeTab from '../features/notification/components/NotificationNoticeTab';
import NotificationStudyTab from '../features/notification/components/NotificationStudyTab';
import NotificationTabs from '../features/notification/components/NotificationTabs';
import { colors } from '../styles/colors';
import { useNotificationCenter } from '../state/NotificationCenterContext';

type NotificationScreenProps = {
  onClose: () => void;
};

function NotificationScreen({ onClose }: NotificationScreenProps) {
  const [activeTab, setActiveTab] = useState<'notice' | 'study'>('notice');
  const { notifications } = useNotificationCenter();

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <NotificationHeader onClose={onClose} />
        <NotificationTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          studyBadgeCount={notifications.length}
        />
        <View>
          {activeTab === 'notice' ? <NotificationNoticeTab /> : <NotificationStudyTab />}
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
});

export default NotificationScreen;
