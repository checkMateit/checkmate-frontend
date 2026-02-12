import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';

type InquiryItem = {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'done';
  content: string;
  answerTitle: string;
  answer: string;
  userReplies: Array<{ title: string; content: string }>;
};

type InquiryListScreenProps = {
  onClose: () => void;
  onPressWrite: () => void;
};

const backIcon = require('../../../assets/icon/right_arrow.png');

function InquiryListScreen({ onClose, onPressWrite }: InquiryListScreenProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [showReply, setShowReply] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyTitle, setReplyTitle] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [items, setItems] = useState<InquiryItem[]>([
    {
      id: 'inquiry-1',
      title: '머시기에 관한 문의',
      date: '2026. 02. 04.',
      status: 'done',
      content: '안녕하세요 머시기에 대해 궁금해요. 머시기를 머시기 할 수 있을까요?',
      answerTitle: '안녕하세요, 체크메이트입니다.',
      answer:
        '안녕하세요, 체크메이트입니다.\n머시기는 현재 머시기할 수 없습니다 :(\n\n머시기 대신 저시기는 있는데 저시기는 어떠신지요?',
      userReplies: [],
    },
    {
      id: 'inquiry-2',
      title: '머시기에 관한 문의',
      date: '2026. 02. 04.',
      status: 'pending',
      content: '안녕하세요 머시기에 대해 궁금해요. 머시기를 머시기 할 수 있을까요?',
      answerTitle: '안녕하세요, 체크메이트입니다.',
      answer:
        '안녕하세요, 체크메이트입니다.\n머시기는 현재 머시기할 수 없습니다 :(\n\n머시기 대신 저시기는 있는데 저시기는 어떠신지요?',
      userReplies: [],
    },
    {
      id: 'inquiry-3',
      title: '머시기에 관한 문의',
      date: '2026. 02. 04.',
      status: 'done',
      content: '안녕하세요 머시기에 대해 궁금해요. 머시기를 머시기 할 수 있을까요?',
      answerTitle: '안녕하세요, 체크메이트입니다.',
      answer:
        '안녕하세요, 체크메이트입니다.\n머시기는 현재 머시기할 수 없습니다 :(\n\n머시기 대신 저시기는 있는데 저시기는 어떠신지요?',
      userReplies: [],
    },
  ]);

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleResolve = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'done' ? 'pending' : 'done' }
          : item,
      ),
    );
  };

  const openReply = (item: InquiryItem) => {
    setActiveReplyId(item.id);
    setReplyTitle('');
    setReplyContent('');
    setShowReply(true);
  };

  const closeReply = () => {
    setShowReply(false);
  };

  const submitReply = () => {
    if (!activeReplyId) {
      setShowReply(false);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === activeReplyId
          ? {
              ...item,
              userReplies: [
                ...item.userReplies,
                {
                  title: replyTitle.trim() || '추가 문의',
                  content: replyContent.trim() || '',
                },
              ],
            }
          : item,
      ),
    );
    setShowReply(false);
  };

  const rows = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        open: openIds.includes(item.id),
      })),
    [items, openIds],
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={10} style={styles.backButton}>
          <Image source={backIcon} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.headerTitle}>1:1 문의</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>내 문의</Text>
          <Pressable style={styles.writeButton} onPress={onPressWrite}>
            <Text style={styles.writeButtonText}>문의 쓰기</Text>
          </Pressable>
        </View>
        {rows.map((item) => (
          <View key={item.id} style={styles.card}>
            <Pressable style={styles.cardTop} onPress={() => toggleOpen(item.id)}>
              <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <View style={styles.cardRight}>
                <View
                  style={[
                    styles.statusChip,
                    item.status === 'done' ? styles.statusDone : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === 'done' ? styles.statusTextDone : styles.statusTextPending,
                    ]}
                  >
                    {item.status === 'done' ? '답변 완료' : '진행중'}
                  </Text>
                </View>
                <Image
                  source={backIcon}
                  style={[styles.arrowIcon, item.open && styles.arrowIconOpen]}
                />
              </View>
            </Pressable>
            {item.open ? (
              <View style={styles.cardBody}>
                <View style={styles.qaRow}>
                  <Text style={styles.qaLabel}>Q</Text>
                  <View style={styles.qaContent}>
                    <Text style={styles.qaTitle}>{item.title}</Text>
                    <Text style={styles.qaText}>{item.content}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.qaRow}>
                  <Text style={styles.qaLabelAnswer}>A</Text>
                  <View style={styles.qaContent}>
                    <Text style={styles.qaTitle}>{item.answerTitle}</Text>
                    <Text style={styles.qaText}>{item.answer}</Text>
                  </View>
                </View>
                {item.userReplies.length > 0 ? (
                  <View style={styles.replyThread}>
                    {item.userReplies.map((reply, index) => (
                      <View key={`${reply.title}-${index}`} style={styles.replyBlock}>
                        <View style={styles.replyDivider} />
                        <View style={styles.qaRow}>
                          <Text style={styles.qaLabel}>Q</Text>
                        <View style={styles.qaContent}>
                          <Text style={styles.qaTitle}>{reply.title}</Text>
                          <Text style={styles.qaText}>{reply.content}</Text>
                        </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => openReply(item)}
                  >
                    <Text style={styles.actionText}>답변 달기</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.actionButton,
                      item.status === 'done' && styles.actionButtonDone,
                    ]}
                    onPress={() => handleResolve(item.id)}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        item.status === 'done' && styles.actionTextDone,
                      ]}
                    >
                      해결 완료
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={showReply}
        animationType="slide"
        onRequestClose={closeReply}
      >
        <SafeAreaView style={styles.replyRoot}>
          <View style={styles.replyHeader}>
            <Pressable onPress={closeReply} hitSlop={10} style={styles.backButton}>
              <Image source={backIcon} style={styles.backIcon} />
            </Pressable>
            <Text style={styles.headerTitle}>답변 달기</Text>
          </View>
          <View style={styles.replyContent}>
            <Text style={styles.replyLabel}>제목</Text>
            <TextInput
              value={replyTitle}
              onChangeText={setReplyTitle}
              placeholder="제목을 작성해주세요."
              placeholderTextColor="#C9C9C9"
              style={styles.replyInput}
            />
            <Text style={styles.replyLabel}>내용</Text>
            <TextInput
              value={replyContent}
              onChangeText={setReplyContent}
              placeholder="내용을 작성해주세요."
              placeholderTextColor="#C9C9C9"
              style={styles.replyTextarea}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={styles.replyBottom}>
            <Pressable style={styles.replySubmitButton} onPress={submitReply}>
              <Text style={styles.replySubmitText}>등록</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    width: 10,
    height: 14,
    tintColor: '#9A9A9A',
    transform: [{ scaleX: -1 }],
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  content: {
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  writeButton: {
    borderWidth: 1,
    borderColor: '#D7D7D7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  writeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  card: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 14,
    color: '#B2B2B2',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusDone: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  statusPending: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFECEC',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextDone: {
    color: '#FFFFFF',
  },
  statusTextPending: {
    color: '#FF6B6B',
  },
  arrowIcon: {
    marginRight: 20,
    width: 8,
    height: 20,
    tintColor: '#C2C2C2',
    transform: [{ rotate: '90deg' }],
  },
  arrowIconOpen: {
    transform: [{ rotate: '270deg' }],
  },
  cardBody: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 16,
    gap: 12,
  },
  qaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  qaLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    width: 24,
  },
  qaLabelAnswer: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    width: 24,
  },
  qaContent: {
    flex: 1,
    gap: 6,
  },
  qaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  qaText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  replyThread: {
    marginTop: 12,
    gap: 10,
  },
  replyBlock: {
    gap: 10,
  },
  replyDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 6,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonDone: {
    backgroundColor: '#3D3D3D',
    borderColor: '#3D3D3D',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3D3D3D',
  },
  actionTextDone: {
    color: '#FFFFFF',
  },
  replyRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  replyContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  replyLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  replyTextarea: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 220,
    fontSize: 14,
    color: colors.textPrimary,
  },
  replyBottom: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 26,
  },
  replySubmitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  replySubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default InquiryListScreen;
