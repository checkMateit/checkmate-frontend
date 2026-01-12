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
import { colors } from '../../styles/colors';
import MascotImage from '../Common/CategoryImage';
export type StatusVariant = 'success' | 'danger' | 'neutral';
export type StatusIconType = 'success' | 'danger';

export type StudyCardProps = {
  tag: string;
  title: string;
  schedule: string;
  members: string;
  statusText: string;
  statusVariant?: StatusVariant;
  statusIcons?: StatusIconType[];
  mascotLabel?: string;
  mascotSource?: ImageSourcePropType;
  onPress?: () => void;
};


const personIcon = require('../../assets/icon/person_icon.png');
const cancelIcon = require('../../assets/icon/cancel_icon.png');
const checkIcon = require('../../assets/icon/check_icon.png');

function StudyCard({
  tag,
  title,
  schedule,
  members,
  statusText,
  statusVariant = 'neutral',
  statusIcons,
  mascotLabel,
  mascotSource,
  onPress,
}: StudyCardProps) {
  const statusIcon =
    statusVariant === 'danger' ? cancelIcon : statusVariant === 'success' ? checkIcon : null;
  const statusIconList =
    statusIcons && statusIcons.length > 0
      ? statusIcons.slice(0, 2)
      : statusIcon
        ? [statusVariant === 'danger' ? 'danger' : 'success']
        : [];

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        {/* left */}
        <View style={styles.leftInfo}>
          <ImageBackground
            source={require('../../assets/icon/category_icon.png')}
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
          {statusIconList.map((iconType, index) => (
            <Image
              key={`${iconType}-${index}`}
              source={iconType === 'danger' ? cancelIcon : checkIcon}
              style={styles.statusIcon}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 30,
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
    paddingRight: 12, 
  },
  category: {
    paddingHorizontal: 10,
    height: 20,
    marginTop: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  mascot: {
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotText: {
    fontSize: 26,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    
  },
  schedule: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
   
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
    width: 17,
    height: 12,
  },
  membersText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statusIcon: {
    width: 20,
    height: 20,
  },
});

export default StudyCard;
