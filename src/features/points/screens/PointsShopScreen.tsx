import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import PointsShopBalanceBar from '../shop/PointsShopBalanceBar';
import PointsShopHeader from '../shop/PointsShopHeader';
import PointsShopSection from '../shop/PointsShopSection';

type PointsShopScreenProps = {
  onClose?: () => void;
};

const allStudyItems = [
  {
    id: 'all-1',
    label: '면제권 x 1',
    priceLabel: '1,000P',
    iconSource: require('../../../assets/ticket/ticket_all.png'),
    iconSize: { width: 56, height: 30 },
  },
  {
    id: 'all-2',
    label: '면제권 x 2',
    priceLabel: '2,000P',
    iconSource: require('../../../assets/ticket/ticket_all_2.png'),
    iconSize: { width: 60, height: 46 },
  },
  {
    id: 'all-3',
    label: '면제권 x 3',
    priceLabel: '3,000P',
    iconSource: require('../../../assets/ticket/ticket_all_3.png'),
    iconSize: { width: 50, height: 58 },
  },
];

const coreStudyItems = [
  {
    id: 'core-1',
    label: '면제권 x 1',
    priceLabel: '1,000P',
    iconSource: require('../../../assets/ticket/ticket.png'),
    iconSize: { width: 56, height: 30 },
  },
  {
    id: 'core-2',
    label: '면제권 x 2',
    priceLabel: '2,000P',
    iconSource: require('../../../assets/ticket/ticket_2.png'),
    iconSize: { width: 60, height: 46 },
  },
  {
    id: 'core-3',
    label: '면제권 x 3',
    priceLabel: '3,000P',
    iconSource: require('../../../assets/ticket/ticket_3.png'),
    iconSize: { width: 50, height: 58 },
  },
];

const todoItems = [
  {
    id: 'todo-1',
    label: '면제권 x 1',
    priceLabel: '1,000P',
    iconSource: require('../../../assets/ticket/ticket.png'),
    iconSize: { width: 56, height: 30 },
  },
  {
    id: 'todo-2',
    label: '면제권 x 2',
    priceLabel: '2,000P',
    iconSource: require('../../../assets/ticket/ticket_2.png'),
    iconSize: { width: 60, height: 46 },
  },
  {
    id: 'todo-3',
    label: '면제권 x 3',
    priceLabel: '3,000P',
    iconSource: require('../../../assets/ticket/ticket_3.png'),
    iconSize: { width: 50, height: 58 },
  },
];

function PointsShopScreen({ onClose }: PointsShopScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PointsShopHeader title="포인트 상점" onBack={onClose} />

        <View style={styles.adBanner}>
          <Text style={styles.adText}>광고</Text>
        </View>

        <PointsShopBalanceBar pointsLabel="10,000P" />

        <PointsShopSection title="모든 스터디 면제권" items={allStudyItems} />
        <PointsShopSection title="코테 스터디 면제권" items={coreStudyItems} />
        <PointsShopSection title="TODO 면제권" items={todoItems} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  adBanner: {
    height: 70,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C6C6C',
  },
});

export default PointsShopScreen;
