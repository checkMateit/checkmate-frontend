import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../styles/colors';
import StudyBoardPostCard from '../StudyBoard/StudyBoardPostCard';
import StudyBoardPostModal from '../StudyBoard/StudyBoardPostModal';
import { useNotificationCenter } from '../../state/NotificationCenterContext';

const screenHeight = Dimensions.get('window').height;

function NotificationStudyTab() {
  const { notifications, addNotification, removeNotification, toggleNotificationLike } =
    useNotificationCenter();
  const [activeStudy, setActiveStudy] = useState<string>('전체');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [draftComment, setDraftComment] = useState('');
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const selectedPost = selectedPostId
    ? notifications.find((post) => post.id === selectedPostId) ?? null
    : null;

  const studyFilters = useMemo(() => {
    const unique = Array.from(new Set(notifications.map((post) => post.studyName)));
    return ['전체', ...unique];
  }, [notifications]);

  const filteredNotifications =
    activeStudy === '전체'
      ? notifications
      : notifications.filter((post) => post.studyName === activeStudy);

  useEffect(() => {
    if (!studyFilters.includes(activeStudy)) {
      setActiveStudy('전체');
    }
  }, [studyFilters, activeStudy]);

  const openPost = (postId: number) => {
    setSelectedPostId(postId);
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

  const handleToggleAlarm = (postId: number) => {
    const post = notifications.find((item) => item.id === postId);
    if (!post) return;
    if (post.alarmEnabled) {
      removeNotification(postId);
      closePost();
      return;
    }
    addNotification({ ...post, alarmEnabled: true });
  };

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
      <View style={styles.filterRow}>
        {studyFilters.map((study) => {
          const isActive = activeStudy === study;
          return (
            <Pressable
              key={study}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveStudy(study)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{study}</Text>
            </Pressable>
          );
        })}
      </View>

      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>알림 설정한 스터디가 없어요.</Text>
        </View>
      ) : (
        filteredNotifications.map((post) => (
          <View key={post.id} style={styles.postGroup}>
            <StudyBoardPostCard
              post={post}
              onPress={(selected) => openPost(selected.id)}
              onToggleLike={toggleNotificationLike}
              variant="card"
              showNamePill={false}
              showStudyPill
            />
          </View>
        ))
      )}

      <StudyBoardPostModal
        visible={modalVisible}
        post={selectedPost}
        translateY={translateY}
        panHandlers={panResponder.panHandlers}
        draftComment={draftComment}
        onChangeDraft={setDraftComment}
        onClose={closePost}
        onToggleLike={toggleNotificationLike}
        onToggleAlarm={handleToggleAlarm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    borderWidth: 0.5,
    borderColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    
  },
  filterText: {
    fontSize: 13,
    color: '#373737',
    fontWeight: '700',
    lineHeight: 16,
  },
  filterTextActive: {
    color: '#373737',
  },
  postGroup: {
    marginBottom: 16,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#9A9A9A',
  },
});

export default NotificationStudyTab;
