import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

export type AuthMethod = '사진' | '위치' | 'TODO' | 'GitHub';

export type MethodConfig = {
  method: AuthMethod;
  todoDeadline: Date;
  todoComplete: Date;
  rangeStart: Date;
  rangeEnd: Date;
  locationType: '개인 위치' | '공통 위치';
  locationName: string;
  /** 공통 위치일 때 그룹장이 지정한 인증 위치 위도 */
  locationLatitude: number | null;
  /** 공통 위치일 때 그룹장이 지정한 인증 위치 경도 */
  locationLongitude: number | null;
  /** GitHub 인증일 때 저장소 URL (https://github.com/owner/repo 또는 owner/repo) */
  githubRepoUrl: string;
  /** GitHub 인증일 때 브랜치 이름 */
  githubBranch: string;
};

type AuthMethodSectionProps = {
  /** 표시할 인증 방식 목록 (카테고리에 따라 GitHub 제외 가능) */
  methods: AuthMethod[];
  primaryConfig: MethodConfig | null;
  secondaryConfig: MethodConfig | null;
  onSelectPrimary: (method: AuthMethod) => void;
  onAddSecondary: () => void;
  onRemoveSecondary: () => void;
};

function AuthMethodSection({
  methods,
  primaryConfig,
  secondaryConfig,
  onSelectPrimary,
  onAddSecondary,
  onRemoveSecondary,
}: AuthMethodSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>인증 방식</Text>
        <View style={styles.actionRow}>
          <Pressable
            style={[
              styles.actionButton,
              (!primaryConfig || secondaryConfig) && styles.actionButtonDisabled,
            ]}
            onPress={onAddSecondary}
            disabled={!primaryConfig || Boolean(secondaryConfig)}
          >
            <Text style={styles.actionText}>+</Text>
          </Pressable>
          <Pressable
            style={[
              styles.actionButton,
              !secondaryConfig && styles.actionButtonDisabled,
            ]}
            onPress={onRemoveSecondary}
            disabled={!secondaryConfig}
          >
            <Text style={styles.actionText}>-</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.chipRow}>
        {methods.map((method) => {
          const isActive = primaryConfig?.method === method;
          return (
            <Pressable
              key={method}
              onPress={() => onSelectPrimary(method)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {method}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 20,
    marginTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default AuthMethodSection;
