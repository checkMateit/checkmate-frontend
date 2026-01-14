import React from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type GestureResponderHandlers,
} from 'react-native';
import { colors } from '../../styles/colors';
import StudyBoardCommentItem from './StudyBoardCommentItem';
import StudyBoardMetaItem from './StudyBoardMetaItem';
import { Post } from './StudyBoardPostTypes';

const likeIcon = require('../../assets/icon/like_icon.png');
const commentIcon = require('../../assets/icon/comment_icon.png');
const submitIcon = require('../../assets/icon/submit_icon.png');
const profileImage = require('../../assets/icon/profile_1.png');
const alarmIcon = require('../../assets/icon/alarm_icon.png');

type StudyBoardPostModalProps = {
  visible: boolean;
  post: Post | null;
  translateY: Animated.Value;
  panHandlers: GestureResponderHandlers;
  draftComment: string;
  onChangeDraft: (value: string) => void;
  onClose: () => void;
  onToggleLike: (postId: number) => void;
  onToggleAlarm: (postId: number) => void;
};

function StudyBoardPostModal({
  visible,
  post,
  translateY,
  panHandlers,
  draftComment,
  onChangeDraft,
  onClose,
  onToggleLike,
  onToggleAlarm,
}: StudyBoardPostModalProps) {
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]} {...panHandlers}>
          <View style={styles.sheetHandle} />
          {post && (
            <ScrollView contentContainerStyle={styles.sheetContent} keyboardShouldPersistTaps="handled">
              <View style={styles.sheetHeader}>
                <View style={styles.sheetHeaderLeft}>
                  <Image source={profileImage} style={styles.sheetAvatar} />
                  <View>
                    <Text style={styles.sheetName}>{post.name}</Text>
                    <Text style={styles.sheetDate}>{post.date}</Text>
                  </View>
                </View>
                <Pressable onPress={() => onToggleAlarm(post.id)}>
                  <Image
                    source={alarmIcon}
                    style={[styles.sheetAlarm, post.alarmEnabled && styles.sheetAlarmActive]}
                  />
                </Pressable>
              </View>
              <Text style={styles.sheetTitle}>{post.title}</Text>
              <Text style={styles.sheetText}>{post.detail}</Text>
              {post.image && (
                <Image source={post.image} style={styles.sheetImage} resizeMode="cover" />
              )}
              <View style={styles.sheetMetaRow}>
                <Pressable onPress={() => onToggleLike(post.id)}>
                  <StudyBoardMetaItem
                    icon={likeIcon}
                    text={`공감 ${post.likes}`}
                    iconSize={{ width: 17, height: 19 }}
                    iconStyle={post.liked ? styles.likedIcon : undefined}
                    textStyle={post.liked ? styles.likedText : undefined}
                  />
                </Pressable>
                <StudyBoardMetaItem
                  icon={commentIcon}
                  text={`댓글 ${post.comments}`}
                  iconSize={{ width: 16, height: 16 }}
                />
              </View>
              <View style={styles.commentDivider} />
              <View style={styles.commentList}>
                {post.commentList.map((comment) => (
                  <StudyBoardCommentItem key={comment.id} comment={comment} />
                ))}
              </View>
            </ScrollView>
          )}
          <View style={styles.commentInputRow}>
            <View style={styles.commentInputWrap}>
              <TextInput
                value={draftComment}
                onChangeText={onChangeDraft}
                placeholder="댓글을 입력하세요."
                placeholderTextColor="#B0B0B0"
                style={styles.commentInput}
              />
              <Pressable style={styles.submitButton}>
                <Image source={submitIcon} style={styles.submitIcon} />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheet: {
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 72,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E1E1E1',
    marginBottom: 12,
  },
  sheetContent: {
    paddingHorizontal: 40,
    paddingBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 45,
  },
  sheetAlarm: {
    alignSelf: 'flex-start',
    width: 22,
    height: 27,
    tintColor: '#CFCFCF',
  },
  sheetAlarmActive: {
    tintColor: colors.primary,
  },
  sheetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sheetName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sheetDate: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sheetText: {
    fontSize: 14,
    color: '#6F6F6F',
    lineHeight: 20,
    marginBottom: 16,
  },
  sheetImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  sheetMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
  },
  likedIcon: {
    tintColor: colors.primary,
  },
  likedText: {
    color: colors.primary,
  },
  commentDivider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginBottom: 16,
  },
  commentList: {
    gap: 12,
  },
  commentInputRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFFFFF',
  },
  commentInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 12,
    color: colors.textPrimary,
  },
  submitButton: {
    width: 29,
    height: 29,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  submitIcon: {
    width: 29,
    height: 29,
  },
});

export default StudyBoardPostModal;
