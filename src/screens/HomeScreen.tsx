import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StudyCard from '../components/StudyCard';
import { colors } from '../styles/colors';

const backgroundSource = require('../assets/image/background.png');
const shopIconSource = require('../assets/icon/shop_icon.png');
const alarmIconSource = require('../assets/icon/alarm_icon.png');
const studyMascotOne = require('../assets/character/cha_1.png');
const studyMascotTwo = require('../assets/character/ch_2.png');
const { width: bgWidth, height: bgHeight } = Image.resolveAssetSource(backgroundSource);
const HEADER_HEIGHT = 40;
const HERO_TEXT_TOP = 12;


function HomeScreen() {
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const heroHeight = Math.round((screenWidth * bgHeight) / bgWidth) + insets.top;

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
          <View style={styles.iconWrapper}>
            <Image
              source={alarmIconSource}
              style={{ width: 22.28, height: 28 }}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </View>
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
            

            <Text style={styles.heroCta}>스터디 전체 보기 ›</Text>
          </View>
        </View>

        <View style={styles.heroCardsWrap}>
          <StudyCard
            tag="코딩"
            title="코테 스터디"
            schedule="월/화/수 · 10:00 - 13:00"
            members="3/5"
            statusText="인증 미완료"
            statusVariant="danger"
            mascotSource={studyMascotOne}
          />
          <StudyCard
            tag="언어"
            title="토익 스터디"
            schedule="매일 · 8:00 - 9:00"
            members="6/6"
            statusText="TODO 인증 완료"
            statusVariant="success"
            mascotSource={studyMascotTwo}
          />
        </View>

        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>이런 스터디는 어때요?</Text>
            <Text style={styles.sectionInfo}>ⓘ</Text>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.studyCard}>
              <View style={styles.cardTop}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>코딩</Text>
                </View>
                <Text style={styles.cardCountSmall}>👥 4/10</Text>
              </View>
              <Text style={styles.cardTitleSmall}>머시기 스터디</Text>
              <Text style={styles.cardMetaSmall}>🕘 매일 · 오전 10:00</Text>
              <Text style={styles.cardMetaSmall}>인증방식 Github (필수), 사진</Text>
            </View>
            <View style={styles.studyCard}>
              <View style={styles.cardTop}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>책상</Text>
                </View>
                <Text style={styles.cardCountSmall}>👥 3/6</Text>
              </View>
              <Text style={styles.cardTitleSmall}>앉아 스터디</Text>
              <Text style={styles.cardMetaSmall}>🕘 매일 · 오전 10:00</Text>
              <Text style={styles.cardMetaSmall}>인증방식 Github (필수), 사진</Text>
            </View>
          </View>
        </View>

        <View style={styles.ad}>
          <Text style={styles.adText}>광고</Text>
        </View>
      </ScrollView>
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
    alignSelf: 'flex-end',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    
  },
  heroCardsWrap: {
    marginTop: -400,
    paddingHorizontal: 16,
    gap: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  chipText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BFC7C2',
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  section: {
    marginTop: 16,
    paddingTop: 18,
    paddingBottom: 20,
    backgroundColor: colors.secondary,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
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
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  studyCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardCountSmall: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  cardTitleSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardMetaSmall: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 4,
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
});

export default HomeScreen;
