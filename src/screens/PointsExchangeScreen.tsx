import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../styles/colors';
import PointsExchangeAccountCard from '../features/points-exchange/components/PointsExchangeAccountCard';
import PointsExchangeAddCard from '../features/points-exchange/components/PointsExchangeAddCard';
import PointsExchangeFlowModal from '../features/points-exchange/components/PointsExchangeFlowModal';
import PointsExchangeHeader from '../features/points-exchange/components/PointsExchangeHeader';
import PointsExchangeSummaryCard from '../features/points-exchange/components/PointsExchangeSummaryCard';

type PointsExchangeScreenProps = {
  onClose?: () => void;
};

function PointsExchangeScreen({ onClose }: PointsExchangeScreenProps) {
  const [flowVisible, setFlowVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PointsExchangeHeader title="포인트 환전" onBack={onClose} />

        <View style={styles.section}>
          <PointsExchangeAccountCard
            title="내 계좌"
            bankName="신한은행"
            accountNumber="1234-1231-1231-4234"
            active
          />
          <PointsExchangeAccountCard
            title="내 계좌 2"
            bankName="하나은행"
            accountNumber="1234-1231-1231-4234"
          />
          <PointsExchangeAddCard />
          <PointsExchangeSummaryCard
            pointsLabel="10,000P"
            onPressExchange={() => setFlowVisible(true)}
          />
        </View>
      </ScrollView>
      <PointsExchangeFlowModal
        visible={flowVisible}
        onClose={() => setFlowVisible(false)}
      />
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
  section: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});

export default PointsExchangeScreen;
