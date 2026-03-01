import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabs from './navigation/BottomTabs';
import { NotificationCenterProvider } from './state/NotificationCenterContext';
import { setAuthToken, setUserId } from './api/client';
import { USE_DEV_AUTH, DEV_ACCESS_TOKEN, DEV_USER_ID } from './api/authDev';

// 앱 로드 시점에 헤더 설정 (HomeScreen 마운트보다 먼저 실행되도록)
if (USE_DEV_AUTH && DEV_ACCESS_TOKEN && DEV_USER_ID) {
  setAuthToken(DEV_ACCESS_TOKEN);
  setUserId(DEV_USER_ID);
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NotificationCenterProvider>
          <NavigationContainer>
            <BottomTabs />
          </NavigationContainer>
        </NotificationCenterProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
