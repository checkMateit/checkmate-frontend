import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MyPageScreen from '../screens/MyPageScreen';

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  History: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const tabIcons = {
  Home: require('../assets/icon/home_icon.png'),
  Search: require('../assets/icon/search_icon.png'),
  History: require('../assets/icon/history_icon.png'),
  MyPage: require('../assets/icon/mypage_icon.png'),
};

const ICON_HEIGHT = 28;
const HISTORY_ICON = {
  active: require('../assets/icon/history_active_icon.png'),
  inactive: require('../assets/icon/history_icon.png'),
};

function BottomTabs() {
  const getIconStyle = (source: number, focused: boolean, useTint = true) => {
    const { width, height } = Image.resolveAssetSource(source);
    const scaledWidth = Math.round((ICON_HEIGHT * width) / height);
    return [
      { width: scaledWidth, height: ICON_HEIGHT },
      useTint ? (focused ? styles.iconFocused : styles.icon) : null,
    ];
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: { paddingVertical: 8 },
        tabBarLabelStyle: {
          marginTop: 6,   
          fontSize: 12,
        },
        tabBarActiveTintColor: '#2ecc71',
        tabBarInactiveTintColor: '#8c8c8c',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => (
            <Image source={tabIcons.Home} style={getIconStyle(tabIcons.Home, focused)} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: '검색',
          tabBarIcon: ({ focused }) => (
            <Image source={tabIcons.Search} style={getIconStyle(tabIcons.Search, focused)} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: '기록',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? HISTORY_ICON.active : HISTORY_ICON.inactive}
              style={getIconStyle(
                focused ? HISTORY_ICON.active : HISTORY_ICON.inactive,
                focused,
                false,
              )}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          title: '마이페이지',
          tabBarIcon: ({ focused }) => (
            <Image source={tabIcons.MyPage} style={getIconStyle(tabIcons.MyPage, focused)} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderRadius:8.31,
    height: 90,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 9.6,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
    borderTopWidth: 0,
  },
  icon: {
    tintColor: '#D9D9D9',
  },
  iconFocused: {
    tintColor: '#2FE377',
  },
});

export default BottomTabs;
