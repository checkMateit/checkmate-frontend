import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import MyStudyHeader from '../../study-board/components/MyStudyHeader';
import MyStudyItem from '../../study-board/components/MyStudyItem';
import { colors } from '../../../styles/colors';
import CreateStudyGroupScreen from './CreateStudyGroupScreen';

type MyStudyScreenProps = {
  onClose: () => void;
};

const mascotOne = require('../../../assets/character/cha_1.png');
const mascotTwo = require('../../../assets/character/ch_2.png');
const filterIcon = require('../../../assets/icon/filter_icon.png');

type StudyItem = {
  id: string;
  image: number;
  tag: string;
  title: string;
  members: string;
  time: string;
  methods: string[];
};

function MyStudyScreen({ onClose }: MyStudyScreenProps) {
  const [showCreateStudy, setShowCreateStudy] = useState(false);
  const [data, setData] = useState<StudyItem[]>([
    {
      id: 'study-1',
      image: mascotOne,
      tag: '기상',
      title: '기상 스터디',
      members: '4/10',
      time: '매일 · 오전 8:00',
      methods: ['사진', 'GPS'],
    },
    {
      id: 'study-2',
      image: mascotTwo,
      tag: '언어',
      title: '일본어 뽀시기',
      members: '4/10',
      time: '월/금 · 오후 2:00',
      methods: ['사진'],
    },
    {
      id: 'study-3',
      image: mascotOne,
      tag: '기상',
      title: '일어나',
      members: '4/10',
      time: '매일 · 오전 7:00',
      methods: ['사진', 'GPS'],
    },
    {
      id: 'study-4',
      image: mascotTwo,
      tag: '언어',
      title: '봉쥬르',
      members: '4/10',
      time: '매일 · 오후 8:00',
      methods: ['사진'],
    },
  ]);

  return (
    <>
      <SafeAreaView style={styles.root}>
        <DraggableFlatList
          data={data}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data: next }) => setData(next)}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <View>
              <MyStudyHeader onClose={onClose} />
              <View style={styles.createSection}>
                <Pressable style={styles.createButton} onPress={() => setShowCreateStudy(true)}>
                  <Text style={styles.createText}>스터디 만들기</Text>
                  <Text style={styles.createPlusText}>+</Text>
                </Pressable>
              </View>
              <View style={styles.filterRow}>
                <Pressable style={styles.filterChip} onPress={() => {}}>
                  <Text style={styles.filterText}>필터</Text>
                  <Image source={filterIcon} style={styles.filterIcon} />
                </Pressable>
              </View>
              <View style={styles.divider} />
            </View>
          }
          renderItem={({ item, drag }: RenderItemParams<StudyItem>) => (
            <MyStudyItem
              image={item.image}
              tag={item.tag}
              title={item.title}
              members={item.members}
              time={item.time}
              methods={item.methods}
              onDrag={drag}
            />
          )}
        />
      </SafeAreaView>
      <Modal
        visible={showCreateStudy}
        animationType="slide"
        onRequestClose={() => setShowCreateStudy(false)}
      >
        <CreateStudyGroupScreen
          onClose={() => {
            setShowCreateStudy(false);
            onClose();
          }}
          onComplete={() => {
            setShowCreateStudy(false);
            setTimeout(() => {
              onClose();
            }, 300);
          }}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 6,
  },
  createSection: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  createPlusText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 22,
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BEBEBE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterIcon: {
    width: 14,
    height: 14,
    tintColor: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 6,
  },
});

export default MyStudyScreen;
