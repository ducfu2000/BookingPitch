import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../constants/theme';
import baseStyles from '../constants/baseCss';

const MessageComponent = ({item, user}) => {
  const status = item.user !== user;

  return (
    <View style={[baseStyles.left]}>
      <View
        style={
          status
            ? styles.messageWrapper
            : [styles.messageWrapper, baseStyles.right]
        }
      >
        <View style={[baseStyles.row, baseStyles.centerVertically]}>
          <Ionicons
            name="person-circle-outline"
            size={30}
            color={COLORS.grayColor}
            style={baseStyles.mt10}
          />
          <View
            style={
              status
                ? styles.message
                : [styles.message, {backgroundColor: 'rgb(194, 243, 194)'}]
            }
          >
            <Text>{item.text}</Text>
          </View>
        </View>
        <Text style={{marginLeft: 40}}>{item.time}</Text>
      </View>
    </View>
  );
};
export default MessageComponent;
const styles = StyleSheet.create({
  message: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'rgb(240, 240, 240)',
  },
});
