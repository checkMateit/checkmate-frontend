import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const FAIL_ICON_COLOR = '#E57373';

type StatusFailIconProps = {
  size?: number;
};

/**
 * 초록 체크 아이콘과 동일 스타일: 빨간 원 배경 + 흰 X.
 */
function StatusFailIcon({ size = 11 }: StatusFailIconProps) {
  const fontSize = size * 0.9;
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: FAIL_ICON_COLOR,
        },
      ]}
    >
      <Text
        style={[styles.x, { fontSize, lineHeight: fontSize }]}
        allowFontScaling={false}
      >
        ×
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  x: {
    color: '#FFFFFF',
    fontWeight: '800',
    includeFontPadding: false,
  },
});

export default StatusFailIcon;
