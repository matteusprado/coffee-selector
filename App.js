import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import CoffeeSelector from './src/components/CoffeeSelector';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C1810" />
      <CoffeeSelector />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1810', // Rich coffee brown background
  },
}); 