import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { colors } from '../../../styles/colors';
import MyPageHeader from '../components/MyPageHeader';
import MyPageProfileRow from '../components/MyPageProfileRow';
import MyPagePointsCard from '../components/MyPagePointsCard';
import MyPageQuickActions from '../components/MyPageQuickActions';
import MyPageSection from '../components/MyPageSection';
import AccountSettingsScreen from './AccountSettingsScreen';
import PointsHistoryScreen from '../../points/screens/PointsHistoryScreen';
import PointsShopScreen from '../../points/screens/PointsShopScreen';
import PointsExchangeScreen from '../../points/screens/PointsExchangeScreen';
import SocialAccountSettingScreen from './SocialAccountSettingScreen';
import InquiryListScreen from './InquiryListScreen';
import InquiryWriteScreen from './InquiryWriteScreen';
import CategorySettingsScreen from './CategorySettingScreen';
import { getMyInfo } from '../../../api/users';
import { UserResponse } from '../../../types/users';
import { getPointBalance } from '../../../api/point';
import NoticeScreen from '../../notice/screens/NoticeScreen';
import AdminNoticeScreen from '../../notice/screens/AdminNoticeScreen';
import BadgeScreen from '../../badge/screens/BadgeScreen';
import AdminBadgeScreen from '../../badge/screens/AdminBadgeScreen';
import MyInventoryScreen from '../../points/screens/MyInventoryScreen';
import { apiClient } from '../../../api';

function MyPageScreen() {
  // 1. 모든 Hook(상태)은 반드시 최상단에 선언
  const [showSettings, setShowSettings] = useState(false);
  const [showPointsHistory, setShowPointsHistory] = useState(false);
  const [showPointsShop, setShowPointsShop] = useState(false);
  const [showPointsExchange, setShowPointsExchange] = useState(false);
  const [showInquiryList, setShowInquiryList] = useState(false);
  const [showInquiryWrite, setShowInquiryWrite] = useState(false);
  const [showCategorySettings, setShowCategorySettings] = useState(false);
  const [showSocialSettings, setShowSocialSettings] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 권한 확인
        const userRole = (apiClient.defaults.headers['X-User-Role'] || 
                          apiClient.defaults.headers.common['X-User-Role']) as string;
        setRole(userRole || 'USER');

        const [userResponse, balanceResponse] = await Promise.all([
          getMyInfo(),
          getPointBalance()
        ]);

        if (userResponse.data?.data) setUserInfo(userResponse.data.data);
        if (balanceResponse.data?.data !== undefined) setBalance(balanceResponse.data.data);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
        setIsReady(true);
      }
    };
    fetchAllData();
  }, []);

  // 2. 로딩 및 서브 화면 렌더링 처리
  if (loading || !isReady) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (showSettings) return <AccountSettingsScreen onClose={() => setShowSettings(false)} />;
  if (showPointsHistory) return <PointsHistoryScreen onClose={() => setShowPointsHistory(false)} />;
  if (showPointsShop) return <PointsShopScreen onClose={() => setShowPointsShop(false)} />;
  if (showPointsExchange) return <PointsExchangeScreen onClose={() => setShowPointsExchange(false)} />;
  if (showCategorySettings) return <CategorySettingsScreen onClose={() => setShowCategorySettings(false)} />;
  if (showSocialSettings) return <SocialAccountSettingScreen onClose={() => setShowSocialSettings(false)} />;
  if (showInventory) return <MyInventoryScreen onClose={() => setShowInventory(false)} />;
  
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

  if (showNotice) {
    return role === 'ADMIN' 
      ? <AdminNoticeScreen onClose={() => setShowNotice(false)} />
      : <NoticeScreen onClose={() => setShowNotice(false)} />;
  }

  if (showBadge) {
    return role === 'ADMIN'
      ? <AdminBadgeScreen onClose={() => setShowBadge(false)} />
      : <BadgeScreen onClose={() => setShowBadge(false)} />;
  }

  // 3. 메인 레이아웃 렌더링
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
          <Text style={{color: '#999'}}>AD</Text>
        </View>

        <View style={styles.sectionGroup}>
          <MyPageSection 
            title="관리" 
            rows={[
              { 
                left: '스터디', 
                onPressLeft: () => console.log('스터디 클릭'),
                right: '연동계정', 
                onPressRight: () => setShowSocialSettings(true) 
              }, 
              { 
                left: '아이템', 
                onPressLeft: () => setShowInventory(true), 
                right: '뱃지', 
                onPressRight: () => setShowBadge(true)
              },
              { 
                left: '추천 스터디 카테고리', 
                onPress: () => setShowCategorySettings(true) 
              }
            ]} 
          />
        </View>

        <View style={styles.sectionGroup}>
          <MyPageSection 
            title="고객지원" 
            rows={[
              { 
                left: '공지사항', 
                right: '이용안내', 
                onPress: () => setShowNotice(true) 
              }, 
              { 
                left: '문의하기', 
                onPress: () => setShowInquiryList(true) 
              }
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
    height: 60,
    backgroundColor: '#F5F5F5',
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