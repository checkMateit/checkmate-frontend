import React, { useMemo, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import MyStudyHeader from '../../study-board/components/MyStudyHeader';
import MyStudyItem from '../../study-board/components/MyStudyItem';
import { colors } from '../../../styles/colors';
import CreateStudyGroupScreen from './CreateStudyGroupScreen';
import {
  categoryOptions,
  formatCategory,
  formatMembers,
  formatMethods,
  formatPrimaryAuthTime,
  formatPeriod,
  formatAuthTimes,
  getMyStudyGroups,
  getStudyGroups,
  methodOptions,
} from '../../../mocks/studyGroups';
import { type HomeStackParamList, type SearchStackParamList } from '../../../navigation/types';
import { type StudyPreview } from '../../search/types';
import { type StudyDetail } from '../../study-detail/screens/StudyDetailScreen';

type MyStudyScreenProps = {
  onClose: () => void;
  mode?: 'my' | 'search';
};

const mascotOne = require('../../../assets/character/cha_1.png');
const mascotTwo = require('../../../assets/character/ch_2.png');
const mascotThree = require('../../../assets/character/ch_3.png');
const mascotFour = require('../../../assets/character/ch_4.png');
const filterIcon = require('../../../assets/icon/filter_icon.png');
type StudyItem = {
  id: string;
  image: number;
  tag: string;
  title: string;
  members: string;
  time: string;
  methods: string[];
  description: string;
  period: string;
  authTimes: { method: string; time: string }[];
};

function MyStudyScreen({ onClose, mode = 'my' }: MyStudyScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const [showCreateStudy, setShowCreateStudy] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [data, setData] = useState<StudyItem[]>(() => {
    const items = mode === 'search' ? getStudyGroups() : getMyStudyGroups();
    const mascots = [mascotOne, mascotTwo, mascotThree, mascotFour];
    return items.map((item, index) => ({
      id: String(item.group_id),
      image: mascots[index % mascots.length],
      tag: formatCategory(item.category),
      title: item.title,
      members: formatMembers(item.member_count, item.max_members),
      time: formatPrimaryAuthTime(item.verify_methods, item.auth_times),
      methods: formatMethods(item.verify_methods),
      description: '안녕하세요, 스터디입니다.',
      period: formatPeriod(item.period),
      authTimes: formatAuthTimes(item.verify_methods, item.auth_times),
    }));
  });

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(item.tag);
      const methodMatch =
        selectedMethods.length === 0 ||
        selectedMethods.some((method) => item.methods.includes(method));
      return categoryMatch && methodMatch;
    });
  }, [data, selectedCategories, selectedMethods]);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const toggleMethod = (value: string) => {
    setSelectedMethods((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedMethods([]);
  };

  const handlePressStudy = (item: StudyItem) => {
    if (mode === 'search') {
      const hasJoinRoute = navigation.getState().routeNames.includes('StudyJoin');
      if (!hasJoinRoute) {
        return;
      }
      const payload: StudyPreview = {
        id: item.id,
        tag: item.tag,
        title: item.title,
        members: item.members,
        description: item.description,
        schedule: item.time,
        period: item.period,
        methods: item.methods,
        authTimes: item.authTimes,
        image: item.image,
      };
      navigation.navigate('StudyJoin', { study: payload });
      return;
    }
    const detail: StudyDetail = {
      id: item.id,
      tag: item.tag,
      title: item.title,
      members: item.members,
      description: item.description,
      schedule: item.time,
      count: '-',
      methods: item.methods,
      image: item.image,
      statusText: '인증 미완료',
      statusVariant: 'neutral',
      statusIcons: [],
      mascotSource: item.image,
    };
    const parentHome = navigation.getParent<NativeStackNavigationProp<HomeStackParamList>>();
    if (parentHome) {
      parentHome.navigate('StudyDetail', { study: detail });
    }
  };

  return (
    <>
      <SafeAreaView style={styles.root}>
        <DraggableFlatList
          data={filteredData}
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
                <Pressable style={styles.filterChip} onPress={() => setShowFilter(true)}>
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
              onPress={() => handlePressStudy(item)}
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

      <Modal
        visible={showFilter}
        animationType="fade"
        transparent
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.filterOverlay}>
          <View style={styles.filterModal}>
            <Text style={styles.filterTitle}>필터</Text>
            <Text style={styles.filterSectionTitle}>카테고리</Text>
            <View style={styles.filterList}>
              {categoryOptions.map((option) => {
                const isActive = selectedCategories.includes(option);
                return (
                  <Pressable
                    key={option}
                    style={[styles.filterItem, isActive && styles.filterItemActive]}
                    onPress={() => toggleCategory(option)}
                  >
                    <View style={[styles.checkbox, isActive && styles.checkboxActive]} />
                    <Text style={[styles.filterItemText, isActive && styles.filterItemTextActive]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.filterSectionTitle}>인증 방식</Text>
            <View style={styles.filterList}>
              {methodOptions.map((option) => {
                const isActive = selectedMethods.includes(option);
                return (
                  <Pressable
                    key={option}
                    style={[styles.filterItem, isActive && styles.filterItemActive]}
                    onPress={() => toggleMethod(option)}
                  >
                    <View style={[styles.checkbox, isActive && styles.checkboxActive]} />
                    <Text style={[styles.filterItemText, isActive && styles.filterItemTextActive]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.filterActions}>
              <Pressable style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetText}>초기화</Text>
              </Pressable>
              <Pressable style={styles.applyButton} onPress={() => setShowFilter(false)}>
                <Text style={styles.applyText}>적용</Text>
              </Pressable>
            </View>
          </View>
        </View>
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
  filterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  filterModal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    minHeight: 360,
    maxHeight: '80%',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 12,
  },
  filterList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
  },
  filterItemActive: {
    borderColor: colors.primary,
    backgroundColor: '#E9FDF1',
  },
  checkbox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  filterItemText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterItemTextActive: {
    color: colors.textPrimary,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  resetButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7D7D7',
  },
  resetText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  applyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 6,
  },
});

export default MyStudyScreen;
