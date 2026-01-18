import React from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../styles/colors';

const backIcon = require('../assets/icon/left_arrow.png');
const profileImage = require('../assets/icon/profile_1.png');

type AccountSettingsScreenProps = {
  onClose?: () => void;
};

function AccountSettingsScreen({ onClose }: AccountSettingsScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Image source={backIcon} style={styles.backIcon} />
          </Pressable>
          <Text style={styles.headerTitle}>계정관리</Text>
        </View>

        <Text style={styles.sectionTitle}>기본 정보</Text>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.profileBlock}>
              <Image source={profileImage} style={styles.avatar} />
              <Text style={styles.name}>이동규</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>닉네임</Text>
                <Text style={styles.infoValue}>LDK</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>성별</Text>
                <Text style={styles.infoValue}>남</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>생년월일</Text>
                <Text style={styles.infoValue}>1998.01.05</Text>
              </View>
            </View>

            <View style={styles.phoneRow}>
              <Text style={styles.infoLabel}>전화번호</Text>
              <Text style={styles.infoValueMuted}>01000000000</Text>
            </View>
          </View>

          <View>
            <View style={styles.cardDivider} />
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionText}>정보 수정</Text>
            </Pressable>
            <View style={styles.cardDivider} />
            <Pressable style={styles.actionButton}>
              <Text style={styles.withdrawText}>회원 탈퇴</Text>
            </Pressable>
          </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 30,
    marginTop: 40,
    marginBottom: 20,
  },
  card: {
    marginTop:10,
    marginHorizontal: 30,
    height: 480,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#FBFBFB',
    paddingHorizontal: 18,
    paddingTop: 22,
    
  },
  cardContent: {
    flex: 1,
    
    justifyContent: 'space-between',  
  },
  profileBlock: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 77,
    height: 77,
    borderRadius: 35,
    marginBottom:15,
  },
  name: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: '#373737',
    fontWeight: '700',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: "#606060",
  },
  infoValueMuted: {
    fontSize: 16,
    color: '#B5B5B5',
    fontWeight: '500',
  },
  phoneRow: {
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginHorizontal: -18,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: "#4F4F4F"
  },
  withdrawText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF7777',
  },
});

export default AccountSettingsScreen;
