import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

function SearchScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>검색</Text>
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

export default SearchScreen;
