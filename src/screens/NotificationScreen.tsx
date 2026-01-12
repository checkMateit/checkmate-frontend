import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import NotificationHeader from '../components/Notification/NotificationHeader';
import NotificationNoticeTab from '../components/Notification/NotificationNoticeTab';
import NotificationStudyTab from '../components/Notification/NotificationStudyTab';
import NotificationTabs from '../components/Notification/NotificationTabs';
import { colors } from '../styles/colors';

type NotificationScreenProps = {
  onClose: () => void;
};

function NotificationScreen({ onClose }: NotificationScreenProps) {
  const [activeTab, setActiveTab] = useState<'notice' | 'study'>('notice');

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <NotificationHeader onClose={onClose} />
        <NotificationTabs activeTab={activeTab} onChange={setActiveTab} />
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
