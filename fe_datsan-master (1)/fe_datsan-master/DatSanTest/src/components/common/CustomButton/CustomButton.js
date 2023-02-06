import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {COLORS} from '../../../constants';
import baseStyles from '../../../constants/baseCss';

const CustomButton = ({
  onPress,
  text,
  type,
  btn_type,
  isLoading,
  width,
  ...props
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        baseStyles.row,
        baseStyles.centerHorizontal,
        styles[`container_${type}`],
        styles[`btn_${type}`],
        type === 'PRIMARY' && {width: width ? width : '100%'},
        type === 'EDIT' && {width: width ? width : '100%'},
        type === 'DISABLED' && {width: width ? width : '100%'},
        type === 'DANGER' && {width: width ? width : '100%'},
      ]}
      {...props}
    >
      {isLoading && <ActivityIndicator color={COLORS.whiteColor} />}
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 5,

    alignItems: 'center',
    borderRadius: 5,
  },
  container_PRIMARY: {
    backgroundColor: COLORS.primaryColor,
  },
  container_DISABLED: {
    backgroundColor: COLORS.lightGrayColor,
  },
  container_DANGER: {
    backgroundColor: COLORS.dangerColor,
  },
  container_EDIT: {
    backgroundColor: COLORS.editColor,
  },
  container_TERTIARY: {},
  btn_PRIMARY: {
    padding: 15,
  },
  btn_DANGER: {
    padding: 15,
  },
  btn_EDIT: {
    padding: 15,
  },
  btn_TERTIARY: {
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  btn_DISABLED: {
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  text: {
    fontWeight: 'bold',
    color: COLORS.whiteColor,
    paddingLeft: 5,
  },
  text_TERTIARY: {
    color: COLORS.grayColor,
  },
});

export default CustomButton;
