import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import {
  configureGoogleSignIn,
  formatGoogleSignInError,
  signInWithGoogle,
} from '../googleSignIn';

type LoginScreenProps = {
  onLogin?: () => void;
};

function LoginScreen({ onLogin }: LoginScreenProps) {
  const [openingGoogle, setOpeningGoogle] = useState(false);

  useEffect(() => {
    try {
      configureGoogleSignIn();
    } catch {
      // 실제 로그인 시점에 사용자에게 에러를 안내한다.
    }
  }, []);

  const handleGoogleLogin = async () => {
    setOpeningGoogle(true);
    try {
      const result = await signInWithGoogle();

      if (result.type === 'cancelled') {
        return;
      }

      onLogin?.();
    } catch (error) {
      Alert.alert('로그인 오류', formatGoogleSignInError(error));
    } finally {
      setOpeningGoogle(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>Checkmate</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={handleGoogleLogin} disabled={openingGoogle}>
            <Text style={styles.buttonText}>
              {openingGoogle ? 'Google 로그인 중...' : 'Google 계정으로 로그인'}
            </Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Kakao 계정으로 로그인</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  root: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 32,
    paddingTop: 72,
    paddingBottom: 148,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#3A3A3A',
  },
  actions: {
    gap: 28,
  },
  button: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A6A6A6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

export default LoginScreen;
