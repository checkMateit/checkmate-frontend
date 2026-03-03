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
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiClient } from '../../../api';
import AdminBadgeScreen from '../../badge/screens/AdminBadgeScreen';
import AdminStoreScreen from '../../points/screens/AdminStoreScreen';

// 에셋 경로 (프로젝트 구조에 맞게 확인 필요)
const cartIcon = require('../../../assets/icon/white_cart_icon.png');
const badgeIcon = require('../../../assets/icon/white_badge_icon.png');
const adminChar = require('../../../assets/character/ch_5.png');
const arrowDown = require('../../../assets/icon/right_arrow.png');
const brandLogoSource = require('../../../assets/checkmate_logo2.png');

function AdminHomeScreen() {
  const insets = useSafeAreaInsets();
  
  // 상태 관리
  const [currentView, setCurrentView] = useState<'HOME' | 'BADGE' | 'STORE'>('HOME');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 문의 목록 데이터 페칭
  const fetchAdminInquiries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/inquiries', {
        params: { page: 0, size: 20 }
      });
      if (response.data && response.data.data) {
        // 답변 대기 중인 항목을 위로 정렬
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

  // 상세 보기 핸들러
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

  // 답변 등록 핸들러
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

  // 조건부 렌더링 (배지 관리 / 상품 관리)
  if (currentView === 'BADGE') {
    return <AdminBadgeScreen onClose={() => setCurrentView('HOME')} />;
  }

  if (currentView === 'STORE') {
    return <AdminStoreScreen onClose={() => setCurrentView('HOME')} />;
  }

  return (
    <View style={styles.container}>
      {/* --- 상단 그린 섹션 (Wave 디자인) --- */}
      <View style={[styles.topSection, { paddingTop: insets.top + 10 }]}>
        <View style={styles.header}>

          <Image source={brandLogoSource} style={styles.logo} resizeMode="contain" />

          <View style={styles.headerIcons}>
            <Pressable hitSlop={10} onPress={() => setCurrentView('STORE')}>
              <Image source={cartIcon} style={styles.topIcon} />
            </Pressable>
            <Pressable hitSlop={10} onPress={() => setCurrentView('BADGE')}>
              <Image source={badgeIcon} style={styles.topIcon} />
            </Pressable>
          </View>
        </View>
        
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>안녕하세요,{"\n"}관리자님</Text>
          <View style={styles.charContainer}>
            <Image source={adminChar} style={styles.charImage} />
          </View>
        </View>
      </View>

      {/* --- 하단 화이트 리스트 섹션 --- */}
      <View style={styles.bottomSection}>
        <Text style={styles.sectionTitle}>전체 문의</Text>
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#2FE377" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollPadding}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2FE377" />
            }
          >
            {inquiries.map((item) => (
              <Pressable 
                key={item.inquiry_id} 
                style={styles.inquiryCard} 
                onPress={() => handlePressInquiry(item.inquiry_id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.userId}>유저 {item.member_id || '익명'}</Text>
                  <Text style={styles.inquiryTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.dateText}>2026. 02. 04.</Text>
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

      {/* --- 답변 등록 모달 --- */}
      <Modal visible={isDetailModalVisible} animationType="slide" transparent={false}>
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
                  placeholder="답변 내용을 입력해주세요..."
                  value={replyText}
                  onChangeText={setReplyText}
                  placeholderTextColor="#BBB"
                />
              </>
            )}
          </ScrollView>
          <Pressable 
            style={[styles.submitButton, !replyText.trim() && { backgroundColor: '#DDD' }]} 
            onPress={submitAnswer} 
            disabled={isSubmitting || !replyText.trim()}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '저장 중...' : '답변 저장하기'}
            </Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  root: { flex: 1, backgroundColor: '#77E48C' },
  topSection: { paddingHorizontal: 20, paddingBottom: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
  logo: { width: 142, height: 28 },
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
  statusBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  statusText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  statusDone: { backgroundColor: '#77E48C' },
  statusWait: { backgroundColor: '#FF6B6B' },
  arrowIcon: { width: 10, height: 10, tintColor: '#CCC', transform: [{ rotate: '-90deg' }] },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#BBB' },


  // 모달 스타일
  modalRoot: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5' 
  },
  modalTitle: { fontSize: 17, fontWeight: '800' },
  closeText: { color: '#999', fontSize: 15 },
  modalContent: { padding: 25 },
  userQuestionBox: { backgroundColor: '#F8F8F8', padding: 20, borderRadius: 15, marginBottom: 25 },
  questionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 10, color: '#1A1A1A' },
  questionContent: { fontSize: 15, color: '#444', lineHeight: 22 },
  adminReply: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#E8F5E9', 
    padding: 15, 
    borderRadius: 15, 
    borderTopRightRadius: 2,
    marginTop: 10, 
    maxWidth: '85%' 
  },
  userAdditional: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#F0F0F0', 
    padding: 15, 
    borderRadius: 15, 
    borderTopLeftRadius: 2,
    marginTop: 10, 
    maxWidth: '85%' 
  },
  commentText: { fontSize: 15, color: '#333' },
  answerInput: { 
    borderWidth: 1.5, 
    borderColor: '#F0F0F0', 
    borderRadius: 15, 
    padding: 20, 
    minHeight: 150, 
    backgroundColor: '#FAFAFA',
    marginTop: 30,
    fontSize: 15,
    textAlignVertical: 'top'
  },
  submitButton: { backgroundColor: '#2FE377', margin: 25, padding: 20, borderRadius: 18, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
});

export default AdminHomeScreen;
