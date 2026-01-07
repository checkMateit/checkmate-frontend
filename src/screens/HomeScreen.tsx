import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>홈</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 24,
  },
});

export default HomeScreen;
