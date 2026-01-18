import React from 'react';
import { StyleSheet, View } from 'react-native';
import RankingChartStrip from './RankingChartStrip';
import RankingSummaryCard from './RankingSummaryCard';

const profileOne = require('../../../assets/icon/profile_1.png');
const profileTwo = require('../../../assets/icon/profile_2.png');
const badgeOne = require('../../../assets/badge/badge_1.png');
const badgeTwo = require('../../../assets/badge/badge_4.png');
const badgeThree = require('../../../assets/badge/badge_5.png');

function StudyReportTab() {
  const rankings = [
    { name: '라즈베리', percent: 70, badge: badgeOne, profile: profileOne, tag: '얼리버드' },
    { name: '단쌀말', percent: 90, badge: badgeTwo, profile: profileTwo, tag: '랭킹왕' },
    { name: 'LDK', percent: 65, badge: badgeThree, profile: profileOne, tag: '성실맨' },
    { name: '서윤호', percent: 90, badge: badgeOne, profile: profileTwo, tag: '뉴비' },
    { name: '서준', percent: 90, badge: badgeTwo, profile: profileOne, tag: '뉴비' },
    { name: '진수', percent: 50, badge: badgeThree, profile: profileTwo, tag: '뉴비' },
  ];

  return (
    <View style={styles.container}>
      <RankingSummaryCard
        title="랭킹"
        description="연속 3일 인증을 완료해서, 70% 달성했어요"
        percent={70}
        points={70}
      />
      <RankingChartStrip items={rankings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingBottom: 32,
  },
});

export default StudyReportTab;
