import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors } from '../../../styles/colors';
import MyPageHeader from '../components/MyPageHeader';
import MyPageProfileRow from '../components/MyPageProfileRow';
import MyPagePointsCard from '../components/MyPagePointsCard';
import MyPageQuickActions from '../components/MyPageQuickActions';
import MyPageSection from '../components/MyPageSection';
import { Text } from 'react-native-gesture-handler';
import AccountSettingsScreen from './AccountSettingsScreen';
import PointsHistoryScreen from '../../points/screens/PointsHistoryScreen';
import PointsShopScreen from '../../points/screens/PointsShopScreen';
import PointsExchangeScreen from '../../points/screens/PointsExchangeScreen';
import InquiryListScreen from './InquiryListScreen';
import InquiryWriteScreen from './InquiryWriteScreen';
import CategorySettingsScreen from './CategorySettingScreen';
import { getMyInfo } from '../../../api/users';
import { UserResponse } from '../../../types/users';
import { getPointBalance } from '../../../api/point';

function MyPageScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [showPointsHistory, setShowPointsHistory] = useState(false);
  const [showPointsShop, setShowPointsShop] = useState(false);
  const [showPointsExchange, setShowPointsExchange] = useState(false);
  const [showInquiryList, setShowInquiryList] = useState(false);
  const [showInquiryWrite, setShowInquiryWrite] = useState(false);
  const [showCategorySettings, setShowCategorySettings] = useState(false);
  
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [userResponse, balanceResponse] = await Promise.all([
          getMyInfo(),
          getPointBalance()
        ]);

        if (userResponse.data?.data) {
          setUserInfo(userResponse.data.data);
        }
        
        if (balanceResponse.data?.data !== undefined) {
          setBalance(balanceResponse.data.data);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (showSettings) return <AccountSettingsScreen onClose={() => setShowSettings(false)} />;
  if (showPointsHistory) return <PointsHistoryScreen onClose={() => setShowPointsHistory(false)} />;
  if (showPointsShop) return <PointsShopScreen onClose={() => setShowPointsShop(false)} />;
  if (showPointsExchange) return <PointsExchangeScreen onClose={() => setShowPointsExchange(false)} />;
  if (showCategorySettings) {return <CategorySettingsScreen onClose={() => setShowCategorySettings(false)} />;}
  
  if (showInquiryWrite) {
    return (
      <InquiryWriteScreen
        onClose={() => setShowInquiryWrite(false)}
        onBack={() => { setShowInquiryWrite(false); setShowInquiryList(true); }}
      />
    );
  }
  
  if (showInquiryList) {
    return (
      <InquiryListScreen
        onClose={() => setShowInquiryList(false)}
        onPressWrite={() => { setShowInquiryList(false); setShowInquiryWrite(true); }}
      />
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MyPageHeader onPressSetting={() => setShowSettings(true)} />
        <MyPageProfileRow name={`${userInfo?.nickname || '회원'} 메이트님`} />
        
        <MyPagePointsCard current={balance} total={5000} />
        
        <MyPageQuickActions
          onPressHistory={() => setShowPointsHistory(true)}
          onPressShop={() => setShowPointsShop(true)}
          onPressExchange={() => setShowPointsExchange(true)}
        />
        <View style={styles.sectionDivider}>
          <Text>광고</Text>
        </View>
        <View style={styles.sectionGroup}>
          <MyPageSection 
            title="관리" 
            rows={[
              { left: '스터디', right: '연동계정' }, 
              { left: '아이템', right: '뱃지' }, 
              { 
                left: '추천 스터디 카테고리', 
                onPress: () => setShowCategorySettings(true) 
              }
            ]} 
          />
          <MyPageSection title="고객지원" rows={[{ left: '공지사항', right: '이용안내' }, { left: '문의하기', onPress: () => setShowInquiryList(true) }]} />
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyPageScreen;
