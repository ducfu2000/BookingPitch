import {View, TextInput, Text, StyleSheet} from 'react-native';
import React from 'react';
import baseStyles from '../../../constants/baseCss';
import Icon from 'react-native-vector-icons/Feather';
import {COLORS} from '../../../constants/theme';
const CustomInput = ({
  label,
  value,
  setValue,
  placeholder,
  secureTextEntry,
  width,
  error,
  ...props
}) => {
  return (
    <View style={{width: width ? width : '100%'}}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, baseStyles.w100]}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          {...props}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'white',

    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: 5,

    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {},
  error: {
    color: COLORS.dangerColor,
    fontSize: 12,
  },
});

export default CustomInput;
