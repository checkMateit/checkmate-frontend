import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

type AuthMethodRowProps = {
  methods: string[];
};

const settingIcon = require('../assets/icon/setting_2_icon.png');
const CHIP_HEIGHT = 14;

function AuthMethodRow({ methods }: AuthMethodRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Image source={settingIcon} style={styles.labelIcon} />
        <Text style={styles.authText}>인증방식</Text>
      </View>
      {methods.map((method) => (
        <MethodChip key={method} label={method} />
      ))}
    </View>
  );
}

type MethodChipProps = {
  label: string;
};

const authIcon = require('../assets/icon/auth_icon.png');

function MethodChip({ label }: MethodChipProps) {
  return (
    <View style={styles.methodWrap}>
      <View style={styles.methodChip}>
        <View style={styles.methodBar} />
        <Text style={styles.methodText}>{label}</Text>
      </View>
      {/* <Image source={authIcon} style={styles.authIcon} resizeMode="contain" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelIcon: {
    width: 12,
    height: 12,
    tintColor: colors.textSecondary,
  },
  authText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  methodWrap: {
    alignItems: 'center',
    gap: 4,
  },
  
methodChip: {
  height: CHIP_HEIGHT,           
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 0.5,
  borderColor: '#D9D9D9',
  borderRadius: 2,
  overflow: 'hidden',
  paddingRight: 6,              
},
methodBar: {
  width: 4,
  height: '100%',                
  backgroundColor: colors.primary,
},
methodText: {
  fontSize: 9,
  color: colors.textSecondary,
  marginLeft: 5,                 
  lineHeight: CHIP_HEIGHT,      
  includeFontPadding: false,     
  textAlignVertical: 'center',  
},
});

export default AuthMethodRow;
