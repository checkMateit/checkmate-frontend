import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '../../../api';
import AdminBadgeScreen from '../../badge/screens/AdminBadgeScreen';

const cartIcon = require('../../../assets/icon/shop_icon.png');
const badgeIcon = require('../../../assets/badge/badge_2.png');
const adminChar = require('../../../assets/character/ch_5.png');
const arrowDown = require('../../../assets/icon/right_arrow.png');

function AdminHomeScreen() {
  const insets = useSafeAreaInsets();
  
  const [currentView, setCurrentView] = useState<'HOME' | 'BADGE'>('HOME');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdminInquiries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/inquiries', {
        params: { page: 0, size: 20 }
      });
      if (response.data && response.data.data) {
        const rawData = response.data.data.inquiries;
      
        const sortedData = [...rawData].sort((a, b) => {
          if (a.status !== 'ANSWERED' && b.status === 'ANSWERED') return -1;
          if (a.status === 'ANSWERED' && b.status !== 'ANSWERED') return 1;
          return 0;
        });
        setInquiries(sortedData);
      }
    } catch (error: any) {
      console.error('목록 로드 실패:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminInquiries();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminInquiries();
  };

  const handlePressInquiry = async (inquiryId: number) => {
    try {
      const res = await apiClient.get(`/inquiries/${inquiryId}`);
      if (res.data?.data) {
        setSelectedInquiry(res.data.data);
        setIsDetailModalVisible(true);
      }
    } catch (error) {
      Alert.alert('에러', '상세 내용을 불러올 수 없습니다.');
    }
  };

  const submitAnswer = async () => {
    if (!replyText.trim() || !selectedInquiry) return;
    try {
      setIsSubmitting(true);
      await apiClient.post(`/inquiries/${selectedInquiry.inquiry_id}/comments`, {
        author_type: 'ADMIN',
        content: replyText.trim()
      });
      Alert.alert('완료', '답변이 등록되었습니다.');
      setIsDetailModalVisible(false);
      setReplyText('');
      fetchAdminInquiries();
    } catch (error) {
      Alert.alert('실패', '등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {currentView === 'BADGE' ? (
        <AdminBadgeScreen onClose={() => setCurrentView('HOME')} />
      ) : (
        <View style={[styles.root, { paddingTop: insets.top }]}>
          <View style={styles.topSection}>
            <View style={styles.header}>
              <Text style={styles.logo}>Checkmate Admin</Text>
              <View style={styles.headerIcons}>
                <Pressable hitSlop={10} style={styles.iconButton}>
                  <Image source={cartIcon} style={styles.topIcon} />
                  <Text style={styles.iconLabel}>상품 관리</Text>
                </Pressable>
                <Pressable 
                  hitSlop={10} 
                  style={styles.iconButton}
                  onPress={() => setCurrentView('BADGE')} 
                >
                  <Image source={badgeIcon} style={styles.topIcon} />
                  <Text style={styles.iconLabel}>뱃지 관리</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.welcomeRow}>
              <Text style={styles.welcomeText}>안녕하세요,{"\n"}관리자 모드입니다</Text>
              <Image source={adminChar} style={styles.charImage} />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.sectionTitle}>사용자 문의 관리</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#77E48C" style={{ marginTop: 50 }} />
            ) : (
              <ScrollView 
                contentContainerStyle={styles.scrollPadding}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#77E48C" />}
              >
                {inquiries.map((item) => (
                  <Pressable 
                    key={item.inquiry_id} 
                    style={styles.inquiryCard} 
                    onPress={() => handlePressInquiry(item.inquiry_id)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.userId}>NO. {item.inquiry_id}</Text>
                      <Text style={styles.inquiryTitle} numberOfLines={1}>{item.title}</Text>
                    </View>
                    <View style={styles.rightContent}>
                      <View style={[
                        styles.statusBadge, 
                        item.status === 'ANSWERED' ? styles.statusDone : styles.statusWait
                      ]}>
                        <Text style={styles.statusText}>
                          {item.status === 'ANSWERED' ? '답변 완료' : '대기중'}
                        </Text>
                      </View>
                      <Image source={arrowDown} style={styles.arrowIcon} />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          <Modal visible={isDetailModalVisible} animationType="slide">
            <SafeAreaView style={styles.modalRoot}>
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setIsDetailModalVisible(false)}>
                  <Text style={styles.closeText}>취소</Text>
                </Pressable>
                <Text style={styles.modalTitle}>문의 답변</Text>
                <View style={{ width: 40 }} />
              </View>
              <ScrollView style={styles.modalContent}>
                {selectedInquiry && (
                  <>
                    <View style={styles.userQuestionBox}>
                      <Text style={styles.questionTitle}>{selectedInquiry.title}</Text>
                      <Text style={styles.questionContent}>{selectedInquiry.content}</Text>
                    </View>
                    {selectedInquiry.comments?.map((c: any, i: number) => (
                      <View key={i} style={c.author_type === 'ADMIN' ? styles.adminReply : styles.userAdditional}>
                        <Text style={styles.commentText}>{c.content}</Text>
                      </View>
                    ))}
                    <TextInput
                      style={styles.answerInput}
                      multiline
                      placeholder="답변 입력..."
                      value={replyText}
                      onChangeText={setReplyText}
                    />
                  </>
                )}
              </ScrollView>
              <Pressable style={styles.submitButton} onPress={submitAnswer} disabled={isSubmitting}>
                <Text style={styles.submitButtonText}>답변 저장하기</Text>
              </Pressable>
            </SafeAreaView>
          </Modal>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#77E48C' },
  topSection: { paddingHorizontal: 20, paddingBottom: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  logo: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  headerIcons: { flexDirection: 'row', gap: 15 },
  iconButton: { alignItems: 'center' },
  topIcon: { width: 22, height: 22, tintColor: '#1A1A1A' },
  iconLabel: { fontSize: 8, fontWeight: '700', marginTop: 3 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', lineHeight: 28 },
  charImage: { width: 80, height: 60, resizeMode: 'contain' },
  bottomSection: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingTop: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 20 },
  scrollPadding: { paddingBottom: 30 },
  inquiryCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  userId: { fontSize: 10, color: '#AAA', marginBottom: 2 },
  inquiryTitle: { fontSize: 15, fontWeight: '700', color: '#333' },
  rightContent: { alignItems: 'flex-end', gap: 6 },
  statusBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, minWidth: 55, alignItems: 'center' },
  statusText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  statusDone: { backgroundColor: '#77E48C' },
  statusWait: { backgroundColor: '#FF6B6B' },
  arrowIcon: { width: 10, height: 10, tintColor: '#CCC', transform: [{ rotate: '-90deg' }] },
  modalRoot: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  modalTitle: { fontSize: 16, fontWeight: '800' },
  closeText: { color: '#AAA', fontSize: 14 },
  modalContent: { padding: 20 },
  userQuestionBox: { backgroundColor: '#F8F8F8', padding: 18, borderRadius: 12, marginBottom: 20 },
  questionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  questionContent: { fontSize: 14, color: '#555', lineHeight: 20 },
  adminReply: { alignSelf: 'flex-end', backgroundColor: '#E8F5E9', padding: 12, borderRadius: 12, marginTop: 10, maxWidth: '85%' },
  userAdditional: { alignSelf: 'flex-start', backgroundColor: '#F0F0F0', padding: 12, borderRadius: 12, marginTop: 10, maxWidth: '85%' },
  commentText: { fontSize: 14, color: '#333' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 25 },
  answerInput: { borderWidth: 1, borderColor: '#EEE', borderRadius: 10, padding: 15, minHeight: 120, backgroundColor: '#FAFAFA' },
  submitButton: { backgroundColor: '#77E48C', margin: 20, padding: 18, borderRadius: 15, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

export default AdminHomeScreen;