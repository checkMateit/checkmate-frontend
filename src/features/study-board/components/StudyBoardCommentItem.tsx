import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { Comment } from './StudyBoardPostTypes';

const profileImage = require('../../../assets/icon/profile_1.png');

type StudyBoardCommentItemProps = {
  comment: Comment;
};

function StudyBoardCommentItem({ comment }: StudyBoardCommentItemProps) {
  return (
    <View style={styles.commentRow}>
      <View style={styles.commentAvatarCol}>
        <Image source={profileImage} style={styles.commentAvatar} />
        <Text style={styles.commentName} numberOfLines={1}>
          {comment.name}
        </Text>
      </View>
      <View style={styles.commentBubble}>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  commentAvatarCol: {
    alignItems: 'center',
    width: 44,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 6,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
    maxWidth: 44,
  },
  commentText: {
    fontSize: 12,
    color: '#6F6F6F',
  },
});

export default StudyBoardCommentItem;
