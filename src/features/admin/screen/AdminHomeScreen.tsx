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

const cartIcon = require('../../../assets/icon/shop_icon.png');
const badgeIcon = require('../../../assets/badge/badge_2.png');
const adminChar = require('../../../assets/character/ch_5.png');
const arrowDown = require('../../../assets/icon/right_arrow.png');

function AdminHomeScreen() {
  const insets = useSafeAreaInsets();
  
  // 상태 관리
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. [목록 조회] 관리자 권한으로 전체 문의 리스트 가져오기
  const fetchAdminInquiries = async () => {
    try {
      const response = await apiClient.get('/inquiries', {
        params: { page: 0, size: 20 }
      });
      if (response.data && response.data.data) {
        setInquiries(response.data.data.inquiries);
      }
    } catch (error: any) {
      console.error('목록 로드 실패:', error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 2. [상세 조회] 특정 문의 클릭 시 상세 내용과 댓글 가져오기
  const handlePressInquiry = async (inquiryId: number) => {
    try {
      // 서버 로그 확인 결과 inquiry_id 필드가 확실하므로 해당 ID로 호출
      const res = await apiClient.get(`/inquiries/${inquiryId}`);
      if (res.data?.data) {
        setSelectedInquiry(res.data.data);
        setIsDetailModalVisible(true);
      }
    } catch (error: any) {
      console.error('상세 조회 실패:', error.response?.data);
      Alert.alert('에러', '상세 내용을 불러올 수 없습니다. ID가 올바른지 확인하세요.');
    }
  };

  // 3. [답변 등록] 관리자 답변 달기
  const submitAnswer = async () => {
    if (!replyText.trim() || !selectedInquiry) {
      Alert.alert('알림', '답변 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      // 백엔드: @PostMapping("/{inquiryId}/comments")
      await apiClient.post(`/inquiries/${selectedInquiry.inquiry_id}/comments`, {
        author_type: 'ADMIN',
        content: replyText.trim()
      });

      Alert.alert('완료', '답변이 성공적으로 등록되었습니다.');
      setIsDetailModalVisible(false);
      setReplyText('');
      fetchAdminInquiries(); // 목록 새로고침 (상태 변경 확인)
    } catch (error: any) {
      Alert.alert('실패', '답변 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchAdminInquiries();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAdminInquiries();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* 관리자 홈 헤더 */}
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Text style={styles.logo}>Checkmate Admin</Text>
          <View style={styles.headerIcons}>
            <Pressable hitSlop={10} style={styles.iconButton}>
              <Image source={cartIcon} style={styles.topIcon} />
              <Text style={styles.iconLabel}>상품 관리</Text>
            </Pressable>
            <Pressable hitSlop={10} style={styles.iconButton}>
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

      {/* 문의 리스트 섹션 */}
      <View style={styles.bottomSection}>
        <Text style={styles.sectionTitle}>사용자 문의 관리</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#77E48C" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollPadding}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#77E48C" />}
          >
            {inquiries.length === 0 ? (
              <Text style={styles.emptyText}>도착한 문의가 없습니다.</Text>
            ) : (
              inquiries.map((item: any) => (
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
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* 상세 조회 및 답변 모달 */}
      <Modal visible={isDetailModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setIsDetailModalVisible(false)}>
              <Text style={styles.closeText}>취소</Text>
            </Pressable>
            <Text style={styles.modalTitle}>문의 상세 및 답변</Text>
            <View style={{ width: 40 }} /> 
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedInquiry && (
              <>
                <View style={styles.userQuestionBox}>
                  <Text style={styles.questionTitle}>{selectedInquiry.title}</Text>
                  <Text style={styles.questionContent}>{selectedInquiry.content}</Text>
                </View>

                {/* 답변 내역 표시 */}
                {selectedInquiry.comments?.map((comment: any, index: number) => (
                  <View 
                    key={index} 
                    style={comment.author_type === 'ADMIN' ? styles.adminReply : styles.userAdditional}
                  >
                    <Text style={styles.authorLabel}>
                      {comment.author_type === 'ADMIN' ? '나의 답변' : '사용자'}
                    </Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                ))}

                <View style={styles.divider} />
                <Text style={styles.inputLabel}>답변 달기</Text>
                <TextInput
                  style={styles.answerInput}
                  multiline
                  placeholder="사용자에게 전달할 답변을 입력하세요."
                  value={replyText}
                  onChangeText={setReplyText}
                  textAlignVertical="top"
                />
              </>
            )}
          </ScrollView>

          <Pressable 
            style={[styles.submitButton, isSubmitting && { opacity: 0.5 }]} 
            onPress={submitAnswer}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>답변 저장하기</Text>}
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
  statusBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  statusText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  statusDone: { backgroundColor: '#77E48C' },
  statusWait: { backgroundColor: '#FF6B6B' },
  arrowIcon: { width: 10, height: 10, tintColor: '#CCC', transform: [{ rotate: '-90deg' }] },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#BBB' },

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
  authorLabel: { fontSize: 9, fontWeight: '700', color: '#999', marginBottom: 3 },
  commentText: { fontSize: 14, color: '#333' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 25 },
  inputLabel: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  answerInput: { borderWidth: 1, borderColor: '#EEE', borderRadius: 10, padding: 15, minHeight: 120, backgroundColor: '#FAFAFA' },
  submitButton: { backgroundColor: '#77E48C', margin: 20, padding: 18, borderRadius: 15, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

export default AdminHomeScreen;