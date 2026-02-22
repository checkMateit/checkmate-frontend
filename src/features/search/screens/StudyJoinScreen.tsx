import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../styles/colors';
import { type SearchStackParamList, type HomeStackParamList } from '../../../navigation/types';
import AuthMethodRow from '../../../components/common/AuthMethodRow';
import { type StudyDetail } from '../../study-detail/screens/StudyDetailScreen';
import { type StudyPreview } from '../types';

const backIcon = require('../../../assets/icon/left_arrow.png');
const categoryIcon = require('../../../assets/icon/category_icon.png');
const personIcon = require('../../../assets/icon/person_icon.png');
function StudyJoinScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const route = useRoute<RouteProp<SearchStackParamList, 'StudyJoin'>>();
  const study = route.params?.study;

  const moveToDetail = () => {
    const detail: StudyDetail = {
      id: study.id,
      tag: study.tag,
      title: study.title,
      members: study.members,
      description: study.description,
      schedule: study.schedule,
      count: '-',
      methods: study.methods,
      image: study.image,
      statusText: '인증 미완료',
      statusVariant: 'neutral',
      statusIcons: [],
      mascotSource: study.image,
    };

    const tabNav = navigation.getParent();
    if (tabNav) {
      tabNav.navigate('Home', {
        screen: 'StudyDetail',
        params: { study: detail, showWelcome: true },
      } as never);
    } else {
      navigation.navigate('StudyJoin', { study });
    }
  };

  if (!study) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.fallback} />
      </SafeAreaView>
    );
  }

  const authTimeRows =
    study.authTimes ??
    study.methods.map((method) => ({
      method,
      time: study.schedule,
    }));

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
            <Image source={backIcon} style={styles.backIcon} />
          </Pressable>
        </View>

        <View style={styles.heroImageWrap}>
          <View style={styles.heroImageFrame}>
            <Image source={study.image} style={styles.heroImage} resizeMode="cover" />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ImageBackground source={categoryIcon} style={styles.tagChip} resizeMode="contain">
              <Text style={styles.tagText}>{study.tag}</Text>
            </ImageBackground>
            <View style={styles.memberRow}>
              <Image source={personIcon} style={styles.memberIcon} />
              <Text style={styles.memberText}>{study.members}</Text>
            </View>
          </View>

          <Text style={styles.title}>{study.title}</Text>
          <Text style={styles.description}>{study.description}</Text>
          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{study.schedule}</Text>
          </View>
          <View style={styles.methodSection}>
            <Text style={styles.methodLabel}>인증 방식</Text>
            <View style={styles.methodList}>
              {authTimeRows.map((item) => (
                <View key={`${item.method}-${item.time}`} style={styles.methodLine}>
                  <AuthMethodRow methods={[item.method]} label="" showIcon={false} />
                  <Text style={styles.methodTime}>{item.time}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.periodRow}>
            <Text style={styles.methodLabel}>기간</Text>
            <Text style={styles.metaText}>{study.period}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable style={styles.joinButton} onPress={moveToDetail}>
          <Text style={styles.joinText}>참여하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  backIcon: {
    width: 18,
    height: 18,
    tintColor: colors.textSecondary,
  },
  heroImageWrap: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },
  heroImageFrame: {
    width: 180,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    marginHorizontal: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: 18,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tagChip: {
    height: 22,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberIcon: {
    width: 14,
    height: 10,
    tintColor: colors.primary,
  },
  memberText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  methodSection: {
    gap: 8,
  },
  methodList: {
    gap: 6,
  },
  methodLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  methodLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  methodTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottom: {
    paddingHorizontal: 26,
    paddingBottom: 20,
  },
  joinButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  fallback: {
    flex: 1,
  },
});

export default StudyJoinScreen;
