import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { type BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { type BottomTabParamList, type HomeStackParamList } from '../../../navigation/types';
import { useNotificationCenter } from '../../../state/NotificationCenterContext';
import StudyCard from '../../study-board/components/StudyCard';
import RecommendStudyCard from '../../study-board/components/RecommendStudyCard';
import { colors } from '../../../styles/colors';
import NotificationScreen from '../../notification/screens/NotificationScreen';
import MyStudyScreen from '../../my-study/screens/MyStudyScreen';
import { type StudyDetail } from '../../study-detail/screens/StudyDetailScreen';
import { type StudyPreview } from '../../search/types';
import AdminHomeScreen from '../../admin/screen/AdminHomeScreen';
import { apiClient } from '../../../api';
import {
  formatCategory,
  formatMembers,
  formatMethods,
  formatPrimaryAuthTime,
  formatPeriod,
  formatAuthTimes,
  formatAuthDays,
  getMyStudyGroups,
  getStudyGroups,
} from '../../../mocks/studyGroups';
const rightIcon = require('../../../assets/icon/right_arrow.png');
const backgroundSource = require('../../../assets/image/background.png');
const emptyCardBg = require('../../../assets/image/linear_bg.png');
const shopIconSource = require('../../../assets/icon/shop_icon.png');
const alarmIconSource = require('../../../assets/icon/alarm_icon.png');
const studyMascotOne = require('../../../assets/character/cha_1.png');
const studyMascotTwo = require('../../../assets/character/ch_2.png');
const studyMascotThree = require('../../../assets/character/ch_3.png');
const studyMascotFour = require('../../../assets/character/ch_4.png');
const emptyHeroMascot = require('../../../assets/character/ch_3.png');
const { width: bgWidth, height: bgHeight } = Image.resolveAssetSource(backgroundSource);
const HEADER_HEIGHT = 40;
const HERO_TEXT_TOP = 12;

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [role, setRole] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const heroHeight = Math.round((screenWidth * bgHeight) / bgWidth) + insets.top;
  const heroContentTop = HEADER_HEIGHT + insets.top + HERO_TEXT_TOP;
  const [activePage, setActivePage] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyStudies, setShowMyStudies] = useState(false);
  const [headerWidth, setHeaderWidth] = useState(0);
  const [helpIconLayout, setHelpIconLayout] = useState({ x: 0, width: 0 });
  const [helpBubbleWidth, setHelpBubbleWidth] = useState(0);
  const { notifications } = useNotificationCenter();

  useEffect(() => {
    try {
      const userRole = apiClient.defaults.headers['X-User-Role'] as string;
      setRole(userRole || 'USER');
    } catch (e) {
      setRole('USER');
    } finally {
      setIsReady(true);
    }
  }, []);


  const recommendStudies = useMemo(() => {
    const items = getStudyGroups();
    const mascots = [studyMascotOne, studyMascotTwo, studyMascotThree, studyMascotFour];
    return items.slice(0, 3).map((item, index) => ({
      id: String(item.group_id),
      tag: formatCategory(item.category),
      members: formatMembers(item.member_count, item.max_members),
      title: item.title,
      time: formatPrimaryAuthTime(item.verify_methods, item.auth_times),
      method: formatMethods(item.verify_methods).join(', '),
      authTimes: formatAuthTimes(item.verify_methods, item.auth_times),
      authDays: formatAuthDays(item.auth_days),
      image: mascots[index % mascots.length],
    }));
  }, []);

  const toStudyDetail = (item: typeof recommendStudies[number]): StudyDetail => ({
    id: item.id,
    tag: item.tag,
    title: item.title,
    members: item.members,
    description: '스터디 설명',
    schedule: item.time,
    count: '0회 인증',
    methods: item.method.split(',').map((value) => value.trim()),
    authTimes: item.authTimes,
    authDays: item.authDays,
    period: formatPeriod('2026-02-04~2026-03-04'),
    image: item.image,
    statusText: '인증 미완료',
    statusVariant: 'neutral',
    statusIcons: [],
    mascotSource: item.image,
  });

  const toStudyPreview = (item: typeof recommendStudies[number]): StudyPreview => ({
    id: item.id,
    tag: item.tag,
    title: item.title,
    members: item.members,
    description: '안녕하세요, 스터디입니다.',
    schedule: item.time,
    period: formatPeriod('2026-02-04~2026-03-04'),
    methods: item.method.split(',').map((value) => value.trim()),
    authTimes: item.authTimes,
    authDays: item.authDays,
    image: item.image,
  });

  const bubbleLeft = headerWidth && helpBubbleWidth ? (headerWidth - helpBubbleWidth) / 2 : 0;
  const tailCenter = helpIconLayout.x + helpIconLayout.width / 2 - bubbleLeft;
  const tailLeft =
    helpBubbleWidth > 0
      ? Math.max(12, Math.min(helpBubbleWidth - 12, tailCenter + 15)) - 6
      : 0;

  useEffect(() => {
    const parent = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
    if (!parent) {
      return;
    }
    const unsubscribe = parent.addListener('tabPress', () => {
      setShowHelp(false);
      setShowNotifications(false);
      setShowMyStudies(false);
    });

    return unsubscribe;
  }, [navigation]);
  const studies = useMemo<StudyDetail[]>(() => {
    const items = getMyStudyGroups();
    const mascots = [studyMascotOne, studyMascotTwo, studyMascotThree, studyMascotFour];
    return items.map((item, index) => ({
      id: String(item.group_id),
      tag: formatCategory(item.category),
      title: item.title,
      members: formatMembers(item.member_count, item.max_members),
      description: '안녕하세요, 스터디입니다',
      schedule: formatPrimaryAuthTime(item.verify_methods, item.auth_times),
      count: '5회 인증',
      methods: formatMethods(item.verify_methods),
      authTimes: formatAuthTimes(item.verify_methods, item.auth_times),
      authDays: formatAuthDays(item.auth_days),
      period: formatPeriod(item.period),
      image: mascots[index % mascots.length],
      statusText: (() => {
        const icons =
          item.verify_methods.length > 1
            ? index % 3 === 0
              ? ['danger', 'danger']
              : index % 3 === 1
                ? ['success', 'danger']
                : ['success', 'success']
            : index % 2 === 0
              ? ['danger']
              : ['success'];
        const hasSuccess = icons.includes('success');
        const hasDanger = icons.includes('danger');
        if (hasSuccess && hasDanger) return '인증 진행중';
        if (hasSuccess) return '인증 완료';
        return '인증 미완료';
      })(),
      statusVariant: index % 2 === 0 ? ('danger' as const) : ('success' as const),
      statusIcons:
        item.verify_methods.length > 1
          ? index % 3 === 0
            ? ['danger', 'danger']
            : index % 3 === 1
              ? ['success', 'danger']
              : ['success', 'success']
          : [index % 2 === 0 ? 'danger' : 'success'],
      mascotSource: mascots[index % mascots.length],
    }));
  }, []);



  const studyPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < studies.length; i += 2) {
      pages.push(studies.slice(i, i + 2));
    }
    return pages;
  }, [studies]);
  const hasStudies = studies.length > 0;
  const heroHeightEmpty = heroHeight;
  const activeHeroHeight = hasStudies ? heroHeight : heroHeightEmpty;

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  if (role === 'ADMIN') {
    return <AdminHomeScreen />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <View
        style={[
          styles.headerOverlay,
          { height: HEADER_HEIGHT + insets.top, paddingTop: insets.top },
        ]}
      >
        <Text style={styles.brand}>Checkmate</Text>
          <View style={styles.iconRow}>
            <View style={styles.iconWrapper}>
              <Image
                source={shopIconSource}
                style={{ width: 30, height: 28 }}
              />
            </View>
            <Pressable style={styles.iconWrapper} onPress={() => setShowNotifications(true)}>
              <Image
                source={alarmIconSource}
                style={{ width: 22.28, height: 28 }}
              />
              {notifications.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notifications.length}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroWrap}>
          <ImageBackground
            source={backgroundSource}
            resizeMode="cover"
            style={[
              styles.heroBackground,
              {
                height: activeHeroHeight,
                marginTop: -insets.top -35,
              },
            ]}
          />
          <View
            style={[
              styles.heroContent,
              { paddingTop: heroContentTop },
            ]}
          >
            <View style={styles.heroTextBlock}>
              {hasStudies ? (
                <>
                  <Text style={styles.heroLine}>승연 메이트님</Text>
                  <Text style={styles.heroLine}>오늘은 스터디 2개가 있어요!</Text>
                </>
              ) : (
                <>
                  <Text style={styles.heroLine}>승연 메이트님 반가워요!</Text>
                  <Text style={styles.heroLine}>참여중인 스터디가 없네요.</Text>
                </>
              )}
            </View>

            {hasStudies ? (
              <Pressable style={styles.heroCtaRow} onPress={() => setShowMyStudies(true)}>
                <Text style={styles.heroCta}>스터디 전체 보기</Text>
                <Image source={rightIcon} style={styles.heroCtaIcon} />
              </Pressable>
            ) : null}

            {!hasStudies ? (
              <>
                <View style={styles.emptyDots}>
                  {[0, 1, 2].map((dotIndex) => (
                    <View key={`empty-dot-${dotIndex}`} style={styles.emptyDot} />
                  ))}
                </View>
                <Image source={emptyHeroMascot} style={styles.heroMascot} resizeMode="contain" />
              </>
            ) : null}
          </View>
        </View>

        {hasStudies ? (
          <>
            <View style={styles.heroCardsWrap}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const nextPage = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                  setActivePage(nextPage);
                }}
              >
                {studyPages.map((page, pageIndex) => (
                  <View key={`study-page-${pageIndex}`} style={[styles.page, { width: screenWidth }]}>
                    {page.map((card, cardIndex) => (
                      <StudyCard
                        key={`${card.title}-${cardIndex}`}
                        tag={card.tag}
                        title={card.title}
                        schedule={card.schedule}
                        members={card.members}
                        statusText={card.statusText}
                        statusVariant={card.statusVariant}
                        statusIcons={card.statusIcons}
                        methods={card.methods}
                        authTimes={card.authTimes}
                        authDays={card.authDays}
                        mascotSource={card.mascotSource}
                        onPress={() => {
                          navigation.navigate('StudyDetail', { study: card });
                        }}
                      />
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.dots}>
              {studyPages.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[styles.dot, index === activePage ? styles.dotActive : null]}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyStudyWrap}>
            <Pressable
              onPress={() => {
                const parent = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
                parent?.navigate('Search', { screen: 'SearchMain' });
              }}
            >
              <ImageBackground
                source={emptyCardBg}
                style={styles.emptyStudyCard}
                imageStyle={styles.emptyStudyCardImage}
              >
                <View style={styles.emptyPlusButton}>
                  <Text style={styles.emptyPlusText}>+</Text>
                </View>
                <Text style={styles.emptyStudyText}>
                  나만의 스터디를 만들거나 참여해보세요!
                </Text>
              </ImageBackground>
            </Pressable>
          </View>
        )}

        <View style={styles.section}>
          <View
            style={styles.sectionHeaderWrap}
            onLayout={(event) => setHeaderWidth(event.nativeEvent.layout.width)}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>이런 스터디는 어때요?</Text>
              {/* <Image source={require('../../../assets/icon/help_icon.png')} style={{ width: 14, height: 14 }} /> */}
              <View
                style={styles.helpWrap}
                onLayout={(event) => setHelpIconLayout(event.nativeEvent.layout)}
              >
                <Pressable onPress={() => setShowHelp(true)} hitSlop={10}>
                  <Image
                    source={require('../../../assets/icon/help_icon.png')}
                    style={{ width: 14, height: 14 }}
                  />
                </Pressable>
              </View>
            </View>

            {showHelp && (
              <View style={styles.helpBubbleContainer}>
                <View
                  style={styles.helpBubble}
                  onLayout={(event) => setHelpBubbleWidth(event.nativeEvent.layout.width)}
                >
                  <Text style={styles.helpBubbleText} numberOfLines={1}>
                    승연님의 관심사를 토대로 스터디 리스트를 짜봤어요!
                  </Text>

                  <Pressable onPress={() => setShowHelp(false)} hitSlop={10}>
                    <Text style={styles.helpBubbleClose}>×</Text>
                  </Pressable>

                  <View style={[styles.helpBubbleTail, { left: tailLeft }]} />
                </View>
              </View>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendRow}
          >
            {recommendStudies.map((item) => (
              <RecommendStudyCard
                key={item.id}
                tag={item.tag}
                members={item.members}
                title={item.title}
                time={item.time}
                method={item.method}
                authTimes={item.authTimes}
                onPress={() => {
                  const parent = navigation.getParent<BottomTabNavigationProp<BottomTabParamList>>();
                  if (parent) {
                    parent.navigate('Search', {
                      screen: 'StudyJoin',
                      params: { study: toStudyPreview(item) },
                    });
                  } else {
                    navigation.navigate('StudyDetail', { study: toStudyDetail(item) });
                  }
                }}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.ad}>
          <Text style={styles.adText}>광고</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showNotifications}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <NotificationScreen onClose={() => setShowNotifications(false)} />
      </Modal>

      <Modal
        visible={showMyStudies}
        animationType="slide"
        onRequestClose={() => setShowMyStudies(false)}
      >
        <MyStudyScreen onClose={() => setShowMyStudies(false)} />
      </Modal>

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
    backgroundColor: colors.background,
  },
  headerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
  },
  heroWrap: {
    position: 'relative',
  },
  heroBackground: {
    width: '100%',
  },
  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconWrapper: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  heroTextBlock: {
    paddingHorizontal:10,
    marginBottom: 50,
    marginTop: -50,
  },
  heroMascot: {
    position: 'absolute',
    right: 12,
    bottom: -90,
    width: 145,
    height: 165,
    zIndex: 1,
  },
  heroLine: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 40,
  },
  
  heroCta: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    
  },
  heroCtaRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroCtaIcon: {
    width: 6,
    height: 15,
    tintColor: '#FFFFFF',
  },
  heroCardsWrap: {
    marginTop: -400,
    paddingHorizontal: 0,
  },
  emptyStudyWrap: {
    marginTop: -330,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  emptyStudyCard: {
    borderRadius: 12,
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  emptyStudyCardImage: {
    
    borderRadius: 12,
  },
  emptyPlusButton: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPlusText: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 28,
  },
  emptyStudyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'absolute',
    left: 40,
    right: 0,
    bottom: 15,
    justifyContent: 'center',
  },
  emptyDot: {
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#2F2F2F',
  },
  page: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7D7D7D',
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
  section: {
    marginTop: 16,
    paddingTop: 18,
    paddingBottom: 20,
    backgroundColor: colors.secondary,
  },
  sectionHeaderWrap: {
    paddingHorizontal: 16,
    marginBottom: 12,
    position: 'relative',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionInfo: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recommendRow: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 7,
  },
  ad: {
    marginTop: 16,
    backgroundColor: '#D9D9D9',
    paddingVertical: 20,
    alignItems: 'center',
  },
  adText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  helpWrap: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpBubbleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -44,
    alignItems: 'center',
    zIndex: 50,
  },
  helpBubble: {
    backgroundColor: '#2FE377',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    maxWidth: 320,
  },
  helpBubbleText: {
    color: '#373737',
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 0,
  },
  helpBubbleClose: {
    color: '#373737',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 16,
  },
  helpBubbleTail: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
  },
  studyDetailOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 20,
  },
});

export default HomeScreen;
