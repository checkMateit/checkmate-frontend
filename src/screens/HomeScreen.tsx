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
import { type BottomTabParamList } from '../navigation/BottomTabs';
import { useNotificationCenter } from '../state/NotificationCenterContext';
import StudyCard from '../features/study-board/components/StudyCard';
import RecommendStudyCard from '../features/study-board/components/RecommendStudyCard';
import { colors } from '../styles/colors';
import NotificationScreen from './NotificationScreen';
import MyStudyScreen from './MyStudyScreen';
import StudyDetailScreen, { type StudyDetail } from './StudyDetailScreen';
const rightIcon = require('../assets/icon/right_arrow.png');
const backgroundSource = require('../assets/image/background.png');
const shopIconSource = require('../assets/icon/shop_icon.png');
const alarmIconSource = require('../assets/icon/alarm_icon.png');
const studyMascotOne = require('../assets/character/cha_1.png');
const studyMascotTwo = require('../assets/character/ch_2.png');
const studyMascotThree = require('../assets/character/ch_3.png');
const studyMascotFour = require('../assets/character/ch_4.png');
const { width: bgWidth, height: bgHeight } = Image.resolveAssetSource(backgroundSource);
const HEADER_HEIGHT = 40;
const HERO_TEXT_TOP = 12;

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const screenWidth = Dimensions.get('window').width;
  const heroHeight = Math.round((screenWidth * bgHeight) / bgWidth) + insets.top;
  const [activePage, setActivePage] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyStudies, setShowMyStudies] = useState(false);
  const [showStudyDetail, setShowStudyDetail] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<StudyDetail | null>(null);
  const [headerWidth, setHeaderWidth] = useState(0);
  const [helpIconLayout, setHelpIconLayout] = useState({ x: 0, width: 0 });
  const [helpBubbleWidth, setHelpBubbleWidth] = useState(0);
  const { notifications } = useNotificationCenter();

  const bubbleLeft = headerWidth && helpBubbleWidth ? (headerWidth - helpBubbleWidth) / 2 : 0;
  const tailCenter = helpIconLayout.x + helpIconLayout.width / 2 - bubbleLeft;
  const tailLeft =
    helpBubbleWidth > 0
      ? Math.max(12, Math.min(helpBubbleWidth - 12, tailCenter + 15)) - 6
      : 0;

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      setShowHelp(false);
      setShowNotifications(false);
      setShowMyStudies(false);
      setShowStudyDetail(false);
      setSelectedStudy(null);
    });

    return unsubscribe;
  }, [navigation]);

  const studies = useMemo<StudyDetail[]>(
    () => [
      {
        id: 'study-1',
        tag: '코딩',
        title: '코테 스터디',
        members: '3/5',
        description: '안녕하세요, 코테 스터디룸입니다',
        schedule: '월/화/수 · 10:00 - 13:00',
        count: '5회 인증',
        methods: ['TODO', '사진'],
        image: studyMascotOne,
        statusText: '인증 미완료',
        statusVariant: 'danger' as const,
        statusIcons: ['danger', 'danger'],
        mascotSource: studyMascotOne,
      },
      {
        id: 'study-2',
        tag: '언어',
        title: '토익 스터디',
        members: '6/6',
        description: '안녕하세요, 토익 빡공 스터디룸입니다',
        schedule: '매일 · 8:00 - 9:00',
        count: '5회 인증',
        methods: ['TODO', '사진'],
        image: studyMascotTwo,
        statusText: 'TODO 인증 완료',
        statusVariant: 'success' as const,
        statusIcons: ['success'],
        mascotSource: studyMascotTwo,
      },
      {
        id: 'study-3',
        tag: '코딩',
        title: '머시기 스터디',
        members: '4/10',
        description: '안녕하세요, 머시기 스터디입니다',
        schedule: '매일 · 오전 10:00',
        count: '3회 인증',
        methods: ['TODO', '사진'],
        image: studyMascotThree,
        statusText: '인증 진행중',
        statusVariant: 'danger' as const,
        statusIcons: ['danger', 'success'],
        mascotSource: studyMascotThree,
      },
      {
        id: 'study-4',
        tag: '책상',
        title: '앉아 스터디',
        members: '3/6',
        description: '안녕하세요, 앉아 스터디입니다',
        schedule: '매일 · 오전 10:00',
        count: '2회 인증',
        methods: ['TODO', '사진'],
        image: studyMascotFour,
        statusText: 'TODO 인증 완료',
        statusVariant: 'success' as const,
        statusIcons: ['success', 'success'],
        mascotSource: studyMascotFour,
      },
      {
        id: 'study-5',
        tag: '코딩',
        title: '깃허브 스터디',
        members: '2/5',
        description: '안녕하세요, 깃허브 스터디입니다',
        schedule: '매일 · 오후 8:00',
        count: '4회 인증',
        methods: ['TODO', '사진'],
        image: studyMascotOne,
        statusText: '인증 미완료',
        statusVariant: 'danger' as const,
        statusIcons: ['danger'],
        mascotSource: studyMascotOne,
      },
      {
        id: 'study-6',
        tag: '영어',
        title: '회화 스터디',
        members: '5/8',
        description: '안녕하세요, 회화 스터디입니다',
        schedule: '월/수/금 · 오후 7:00',
        count: '5회 인증',
        methods: ['TODO', '사진'],
        image: studyMascotTwo,
        statusText: '인증 진행중',
        statusVariant: 'success' as const,
        statusIcons: ['success', 'danger'],
        mascotSource: studyMascotTwo,
      },
    ],
    [],
  );

  const studyPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < studies.length; i += 2) {
      pages.push(studies.slice(i, i + 2));
    }
    return pages;
  }, [studies]);

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
                height: heroHeight,
                marginTop: -insets.top -35,
              },
            ]}
          />
          <View
            style={[
              styles.heroContent,
              { paddingTop: HEADER_HEIGHT + insets.top + HERO_TEXT_TOP },
            ]}
          >
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroLine}>
                <Text>승연 메이트님</Text>
              </Text>
              <Text style={styles.heroLine}>
                <Text>오늘은 스터디 2개가 있어요!</Text>
              </Text>
            </View>
            

            <Pressable style={styles.heroCtaRow} onPress={() => setShowMyStudies(true)}>
              <Text style={styles.heroCta}>스터디 전체 보기</Text>
              <Image source={rightIcon} style={styles.heroCtaIcon} />
            </Pressable>
          </View>
        </View>

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
                    mascotSource={card.mascotSource}
                    onPress={() => {
                      setSelectedStudy(card);
                      setShowStudyDetail(true);
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

        <View style={styles.section}>
          <View
            style={styles.sectionHeaderWrap}
            onLayout={(event) => setHeaderWidth(event.nativeEvent.layout.width)}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>이런 스터디는 어때요?</Text>
              {/* <Image source={require('../assets/icon/help_icon.png')} style={{ width: 14, height: 14 }} /> */}
              <View
                style={styles.helpWrap}
                onLayout={(event) => setHelpIconLayout(event.nativeEvent.layout)}
              >
                <Pressable onPress={() => setShowHelp(true)} hitSlop={10}>
                  <Image
                    source={require('../assets/icon/help_icon.png')}
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
            <RecommendStudyCard
              tag="코딩"
              members="4/10"
              title="머시기 스터디"
              time="매일 · 오전 10:00"
              method="Github (필수), 사진"
            />
            <RecommendStudyCard
              tag="책상"
              members="3/6"
              title="앉아 스터디"
              time="매일 · 오전 10:00"
              method="Github (필수), 사진"
            />
            <RecommendStudyCard
              tag="언어"
              members="2/5"
              title="회화 스터디"
              time="월/수/금 · 오후 7:00"
              method="Github (필수), 사진"
            />
            <RecommendStudyCard
              tag="코딩"
              members="5/8"
              title="알고리즘 스터디"
              time="매일 · 오후 9:00"
              method="Github (필수), 사진"
            />
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

      {showStudyDetail && selectedStudy ? (
        <View style={styles.studyDetailOverlay}>
          <StudyDetailScreen
            study={selectedStudy}
            onClose={() => setShowStudyDetail(false)}
          />
        </View>
      ) : null}
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
    marginBottom: 50,
    marginTop: -50,
  },
  heroLine: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
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
