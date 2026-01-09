import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

function StudyBoardTab() {
  return (
    <View style={styles.container}>
      {[
        {
          title: '혹시 이 문제 답이 왜 이런지 아시는 분?',
          desc: '한시간 째 문제를 보고 있는데도 이유를 모르겠어요.',
        },
        {
          title: '오류나요 자꾸..',
          desc: '왜 자꾸 여기서 오류가 날까요ㅠㅠ 전문가님 도와주세요',
        },
      ].map((post, index) => (
        <View key={`${post.title}-${index}`} style={styles.postCard}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDesc}>{post.desc}</Text>
          <View style={styles.postFooter}>
            <Text style={styles.postMeta}>👍 1</Text>
            <Text style={styles.postMeta}>💬 1</Text>
            <View style={styles.postImage} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  postCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  postDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postMeta: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  postImage: {
    marginLeft: 'auto',
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
  },
});

export default StudyBoardTab;
