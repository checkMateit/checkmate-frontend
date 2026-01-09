import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BadgeSection from './BadgeSection';
import CalendarSection from './CalendarSection';
import { colors } from '../styles/colors';

type HistoryStatsTabProps = {
  currentMonth: Date;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
};

const badgeOne = require('../assets/badge/badge_1.png');
const badgeTwo = require('../assets/badge/badge_2.png');
const badgeThree = require('../assets/badge/badge_3.png');

function HistoryStatsTab({
  currentMonth,
  selectedDate,
  onSelectDate,
  onChangeMonth,
}: HistoryStatsTabProps) {
  return (
    <View>
      <View style={styles.profileBlock}>
        <Text style={styles.profileName}>승연 메이트님</Text>
        <Text style={styles.profileSubtitle}>11월에는 총 13번 인증했어요!</Text>
      </View>

      <BadgeSection
        title="11월의 뱃지"
        badges={[
          {
            image: badgeOne,
            title: 'Top Mate',
            description: '○○스터디 인증 1등',
          },
          {
            image: badgeTwo,
            title: 'MVP',
            description: '총합점수 1등',
          },
          {
            image: badgeThree,
            title: '뱃지 수집가',
            description: '뱃지 총 10개 달성',
          },
        ]}
      />

      <CalendarSection
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        onChangeMonth={onChangeMonth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileBlock: {
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  profileSubtitle: {
    fontSize: 19,
    color: '#373737',
    fontWeight: '600',
  },
});

export default HistoryStatsTab;
