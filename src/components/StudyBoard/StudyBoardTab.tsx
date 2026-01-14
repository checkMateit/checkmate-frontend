import React, { useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import StudyBoardPostCard from './StudyBoardPostCard';
import StudyBoardPostModal from './StudyBoardPostModal';
import { Post } from './StudyBoardPostTypes';
import { useNotificationCenter } from '../../state/NotificationCenterContext';

const sampleImage = require('../../assets/image/background.png');

const initialPosts: Post[] = [
  {
    id: 1,
    studyName: '토익 스터디',
    name: '라즈베리',
    title: '혹시 이 문제 답이 왜 이런지 아시는 분?',
    desc: '한시간 째 문제를 보고 있는데도 이유를 모르겠어요.\n혹시 아시는 분 제발 알려주세요 !!',
    detail: '아오 진짜 모르겠어요',
    date: '01/11 19:41',
    likes: 2,
    liked: false,
    alarmEnabled: false,
    comments: 3,
    image: sampleImage,
    commentList: [
      { id: 1, name: '단쌀말', text: '어디서 막히는지 캡처 있나요?' },
      { id: 2, name: 'LDK', text: '힌트는 문제 조건 3번이에요.' },
    ],
  },
  {
    id: 2,
    studyName: '○○ 스터디',
    name: '단쌀말',
    title: '오류나요 자꾸..',
    desc: '왜 자꾸 여기서 오류가 날까요ㅠㅠ\n전문가님 도와주세요',
    detail: '왜 자꾸 여기서 오류가 날까요ㅠㅠ 전문가님 도와주세요',
    date: '01/10 21:08',
    likes: 1,
    liked: false,
    alarmEnabled: false,
    comments: 1,
    commentList: [{ id: 1, name: '라즈베리', text: '로그 한번 더 확인해봐요!' }],
  },
  {
    id: 3,
    studyName: '○○ 스터디',
    name: 'LDK',
    title: '오류나요 자꾸..',
    desc: '왜 자꾸 여기서 오류가 날까요ㅠㅠ\n전문가님 도와주세요',
    detail: '왜 자꾸 여기서 오류가 날까요ㅠㅠ 전문가님 도와주세요',
    date: '01/09 13:22',
    likes: 1,
    liked: false,
    alarmEnabled: false,
    comments: 1,
    commentList: [{ id: 1, name: '단쌀말', text: '코드 일부 공유해줄 수 있나요?' }],
  },
];

const screenHeight = Dimensions.get('window').height;

function StudyBoardTab() {
  const { addNotification, removeNotification, updateNotification } = useNotificationCenter();
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [draftComment, setDraftComment] = useState('');
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const openPost = (post: Post) => {
    setSelectedPostId(post.id);
    setModalVisible(true);
    translateY.setValue(screenHeight);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closePost = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedPostId(null);
      setDraftComment('');
    });
  };

  const toggleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updated = {
          ...post,
          liked: !post.liked,
          likes: post.liked ? Math.max(0, post.likes - 1) : post.likes + 1,
        };
        updateNotification(updated);
        return updated;
      }),
    );
  };

  const toggleAlarm = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updated = { ...post, alarmEnabled: !post.alarmEnabled };
        if (updated.alarmEnabled) {
          addNotification(updated);
        } else {
          removeNotification(post.id);
        }
        return updated;
      }),
    );
  };

  const selectedPost = selectedPostId
    ? posts.find((post) => post.id === selectedPostId) ?? null
    : null;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 6,
        onPanResponderMove: (_, gesture) => {
          if (gesture.dy > 0) {
            translateY.setValue(gesture.dy);
          }
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy > 120 || gesture.vy > 1) {
            closePost();
          } else {
            Animated.timing(translateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [translateY],
  );

  return (
    <View style={styles.container}>
      {posts.map((post) => (
        <StudyBoardPostCard key={post.id} post={post} onPress={openPost} onToggleLike={toggleLike} />
      ))}

      <StudyBoardPostModal
        visible={modalVisible}
        post={selectedPost}
        translateY={translateY}
        panHandlers={panResponder.panHandlers}
        draftComment={draftComment}
        onChangeDraft={setDraftComment}
        onClose={closePost}
        onToggleLike={toggleLike}
        onToggleAlarm={toggleAlarm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 35,
    paddingBottom: 24,
  },
});

export default StudyBoardTab;
