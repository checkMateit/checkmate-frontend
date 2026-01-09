import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

type RankingSummaryCardProps = {
  title: string;
  description: string;
  percent: number;
};

const rankingIcon = require('../assets/icon/ranking.png');
const RANKING_ICON_RATIO = 1268 / 772;
const SCREEN_WIDTH = Dimensions.get('window').width;
const RANKING_BG_WIDTH = SCREEN_WIDTH - 40;

function RankingSummaryCard({ title, description, percent }: RankingSummaryCardProps) {
  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <ImageBackground
        source={rankingIcon}
        style={styles.titleIcon}
        imageStyle={styles.titleIconImage}
        resizeMode="contain"
      >
        
        <View style={styles.reportCard}>
          <Text style={styles.reportText}>{description}</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{percent}%</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  titleIcon: {
    width: RANKING_BG_WIDTH,
    aspectRatio: RANKING_ICON_RATIO,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    paddingTop: 16,
  },
  titleIconImage: {
    width: '100%',
    height: '100%',
  },
  titleIconText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    top: 12,
  },
  reportCard: {
    width: '82%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignSelf: 'center',
    marginTop: 48,
  },
  reportText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E2E2',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default RankingSummaryCard;
