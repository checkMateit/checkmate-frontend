import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';
import MyPageHeader from '../features/mypage/components/MyPageHeader';
import MyPageProfileRow from '../features/mypage/components/MyPageProfileRow';
import MyPagePointsCard from '../features/mypage/components/MyPagePointsCard';
import MyPageQuickActions from '../features/mypage/components/MyPageQuickActions';
import MyPageSection from '../features/mypage/components/MyPageSection';
import { Text } from 'react-native-gesture-handler';
import AccountSettingsScreen from './AccountSettingsScreen';
import PointsHistoryScreen from './PointsHistoryScreen';
import PointsShopScreen from './PointsShopScreen';

function MyPageScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [showPointsHistory, setShowPointsHistory] = useState(false);
  const [showPointsShop, setShowPointsShop] = useState(false);

  if (showSettings) {
    return <AccountSettingsScreen onClose={() => setShowSettings(false)} />;
  }
  if (showPointsHistory) {
    return <PointsHistoryScreen onClose={() => setShowPointsHistory(false)} />;
  }
  if (showPointsShop) {
    return <PointsShopScreen onClose={() => setShowPointsShop(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MyPageHeader onPressSetting={() => setShowSettings(true)} />
        <MyPageProfileRow name="박신영 메이트님" />
        <MyPagePointsCard current={700} total={1000} />
        <MyPageQuickActions
          onPressHistory={() => setShowPointsHistory(true)}
          onPressShop={() => setShowPointsShop(true)}
        />
        <View style={styles.sectionDivider} >
          <Text>광고</Text>
        </View>
        <View style={styles.sectionGroup}>
          <MyPageSection
            title="관리"
            rows={[
              { left: '스터디', right: '연동계정' },
              { left: '아이템', right: '뱃지' },
              { left: '추천 스터디 카테고리' },
            ]}
          />
          <MyPageSection
            title="고객지원"
            rows={[
              { left: '공지사항', right: '이용안내' },
              { left: '문의하기' },
            ]}
          />
        </View>
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
  sectionGroup: {
    marginTop: 8,
  },
  sectionDivider: {
    height: 55,
    backgroundColor: '#EFEFEF',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyPageScreen;
