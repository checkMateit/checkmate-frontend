import React from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';
import AuthMethodRow from '../../../components/common/AuthMethodRow';

type MyStudyItemProps = {
  image: ImageSourcePropType;
  tag: string;
  title: string;
  members: string;
  time: string;
  methods: string[];
  onDrag?: () => void;
};

const personIcon = require('../../../assets/icon/person_icon.png');
const timeIcon = require('../../../assets/icon/time_icon.png');
const categoryIcon = require('../../../assets/icon/category_icon.png');

function MyStudyItem({ image, tag, title, members, time, methods, onDrag }: MyStudyItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        <Image source={image} style={styles.avatar} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.tagRow}>
            <ImageBackground
              source={categoryIcon}
              style={styles.tagChip}
              resizeMode="contain"
            >
              <Text style={styles.tagText}>{tag}</Text>
            </ImageBackground>
            <View style={styles.memberRow}>
              <Image source={personIcon} style={styles.memberIcon} />
              <Text style={styles.memberText}>{members}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaRow}>
          <Image source={timeIcon} style={styles.timeIcon} />
          <Text style={styles.metaText}>{time}</Text>
        </View>
        <AuthMethodRow methods={methods} />
      </View>
      <Pressable style={styles.handle} onLongPress={onDrag} hitSlop={8}>
        <Image source={require('../../../assets/icon/edit_icon.png')} style={styles.handleLine} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  avatarWrap: {
    width: 108,
    height: 108,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 75,
    height: 75,
  },
  content: {
    flex: 1,
  },
  topRow: {
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagChip: {
    height: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 10,
  },
  memberIcon: {
    width: 13,
    height: 9,
    tintColor: colors.primary,
  },
  memberText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  timeIcon: {
    marginLeft: 1,
    width: 10,
    height: 10,
    tintColor: colors.textSecondary,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#515151',
  },
  handle: {
    marginLeft: 12,
    marginRight: 6,
    gap: 4,
  },
  handleLine: {
    width: 17,
    height: 7,
    
  },
});

export default MyStudyItem;
