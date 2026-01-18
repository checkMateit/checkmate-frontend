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
      <Image source={profileImage} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentName} numberOfLines={1}>
            {comment.name}
          </Text>
          {comment.date && <Text style={styles.commentDate}>{comment.date}</Text>}
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
    paddingTop: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    maxWidth: 140,
  },
  commentDate: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  commentText: {
    fontSize: 13,
    color: '#4F4F4F',
    lineHeight: 18,
  },
});

export default StudyBoardCommentItem;
