import React from 'react';
import { Image, ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';
import MascotImage from './CategoryImage';
type StatusVariant = 'success' | 'warning' | 'danger' | 'neutral';

type StudyCardProps = {
  tag: string;
  title: string;
  schedule: string;
  members: string;
  statusText: string;
  statusVariant?: StatusVariant;
  mascotLabel?: string;
  mascotSource?: ImageSourcePropType;
};


const STATUS_COLORS: Record<StatusVariant, string> = {
  success: colors.primary,
  warning: '#FFB547',
  danger: '#FF6B6B',
  neutral: colors.textSecondary,
};

const personIcon = require('../assets/icon/person_icon.png');
const cancelIcon = require('../assets/icon/cancel_icon.png');
const checkIcon = require('../assets/icon/check_icon.png');

function StudyCard({
  tag,
  title,
  schedule,
  members,
  statusText,
  statusVariant = 'neutral',
  mascotLabel,
  mascotSource,
}: StudyCardProps) {
  const statusColor = STATUS_COLORS[statusVariant];
  const statusIcon =
    statusVariant === 'danger' ? cancelIcon : statusVariant === 'success' ? checkIcon : null;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {/* left */}
        <View style={styles.leftInfo}>
          <ImageBackground
            source={require('../assets/icon/category_icon.png')}
            style={styles.category}
            resizeMode="contain">
            <Text style={styles.chipText}>{tag}</Text>
          </ImageBackground>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.schedule}>{schedule}</Text>
        </View>

        {/* right */}
        <View style={styles.mascot}>
          {mascotSource ? (
            <MascotImage source={mascotSource} />
          ) : (
            <Text style={styles.mascotText}>{mascotLabel}</Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.membersRow}>
          <Image source={personIcon} style={styles.membersIcon} />
          <Text style={styles.membersText}>{members}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>{statusText}</Text>
          {statusIcon ? (
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Image source={statusIcon} style={styles.statusIcon} />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    height: 159,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  leftInfo: {
    flex: 1,
    paddingRight: 12, // ⭐ 오른쪽 마스코트랑 겹침 방지
  },
  category: {
    paddingHorizontal: 20,
    height: 20,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  mascot: {
    width: 82,
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  mascotText: {
    fontSize: 26,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    paddingLeft: 10,
  },
  schedule: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
    paddingLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  membersIcon: {
    width: 18,
    height: 18,
  },
  membersText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    width: 12,
    height: 12,
    tintColor: '#FFFFFF',
  },
});

export default StudyCard;
