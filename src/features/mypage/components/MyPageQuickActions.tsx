import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const historyIcon = require('../../../assets/icon/bill_icon.png');
const shopIcon = require('../../../assets/icon/shop_icon.png');
const exchangeIcon = require('../../../assets/icon/exchange_icon.png');

const actions = [
  { label: '내역', icon: historyIcon, width: 22, height: 26 },
  { label: '상점', icon: shopIcon, width: 30, height: 28 },
  { label: '환전', icon: exchangeIcon, width: 26, height: 26 },
];

function MyPageQuickActions() {
  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <View key={action.label} style={styles.item}>
          <Image
            source={action.icon}
            style={[styles.icon, { width: action.width, height: action.height }]}
          />
          <Text style={styles.label}>{action.label}</Text>
          {index < actions.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 18,
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 6,
    
  },
  item: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#8F8F8F',
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: "#7F7F7F",
  },
  divider: {
    position: 'absolute',
    right: 0,
    top: 15,
    bottom: 15,
    width: 1,
    backgroundColor: '#E3E3E3',
  },
});

export default MyPageQuickActions;
