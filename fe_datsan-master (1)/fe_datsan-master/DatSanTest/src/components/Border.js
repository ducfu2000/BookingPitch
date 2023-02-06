import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import baseStyles from '../constants/baseCss';
import {COLORS} from '../constants';

const Border = () => {
  return (
    <View style={[styles.borderContainer, baseStyles.mv10]}>
      <View style={styles.border} />
    </View>
  );
};

export default Border;

const styles = StyleSheet.create({
  borderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    flex: 0.8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrayColor,
  },
});
