import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';
import PointsHistoryList from '../history/PointsHistoryList';
import PointsHistoryMonthNav from '../history/PointsHistoryMonthNav';
import PointsHistoryTabs from '../history/PointsHistoryTabs';

const backIcon = require('../../../assets/icon/left_arrow.png');

type PointsHistoryScreenProps = {
  onClose?: () => void;
};

function PointsHistoryScreen({ onClose }: PointsHistoryScreenProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1));

  const monthLabel = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

  const allItems = useMemo(
    () => [
      {
        id: '1',
        dateLabel: '23일 화요일',
        title: '기상 스터디 인증',
        type: 'earn' as const,
        amountLabel: '+1000P',
      },
      {
        id: '2',
        dateLabel: '22일 월요일',
        title: '일일 인증 무료권 구매',
        type: 'use' as const,
        amountLabel: '-2000P',
      },
      {
        id: '3',
        dateLabel: '21일 일요일',
        title: '기상 스터디 인증',
        type: 'exchange' as const,
        amountLabel: '-3000P',
      },
    ],
    [],
  );

  const items = useMemo(() => {
    if (activeTab === 'all') {
      return allItems;
    }
    return allItems.filter((item) => item.type === activeTab);
  }, [activeTab, allItems]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Image source={backIcon} style={styles.backIcon} />
          </Pressable>
          <Text style={styles.headerTitle}>포인트 내역</Text>
        </View>

        <PointsHistoryTabs activeKey={activeTab} onChange={setActiveTab} />
        <PointsHistoryMonthNav
          label={monthLabel}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
        />
        <PointsHistoryList items={items} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  backIcon: {
    width: 8,
    height: 16,
    tintColor: '#B8B8B8',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default PointsHistoryScreen;
