import React from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';

const BlankScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#e8ecf4'}}>
      <View style={styles.container}></View>
    </SafeAreaView>
  );
};

export default BlankScreen;
const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
