import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import MyStudyHeader from '../../study-board/components/MyStudyHeader';
import MyStudyItem from '../../study-board/components/MyStudyItem';
import { colors } from '../../../styles/colors';

type MyStudyScreenProps = {
  onClose: () => void;
};

const mascotOne = require('../../../assets/character/cha_1.png');
const mascotTwo = require('../../../assets/character/ch_2.png');

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
    <SafeAreaView style={styles.root}>
      <DraggableFlatList
        data={data}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data: next }) => setData(next)}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View>
            <MyStudyHeader onClose={onClose} />
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
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 6,
  },
});

export default MyStudyScreen;
