import React from 'react';
import {Image, View, Text} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {COLORS} from '../../../constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
const DropDown = ({data, onSelect, label, selectLabel, width, ...props}) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={onSelect}
      buttonTextAfterSelection={(selectedItem, index) => {
        return label ? selectedItem[label] : selectedItem;
      }}
      rowTextForSelection={(item, index) => {
        return label ? item[label] : item;
      }}
      dropdownStyle={{
        color: COLORS.grayColor,
        width: width - 50,
        minHeight: 120,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
      }}
      buttonStyle={{
        width: width,
        backgroundColor: COLORS.whiteColor,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.lightGrayColor,
        marginVertical: 5,
      }}
      buttonTextStyle={{fontSize: 16, color: COLORS.grayColor}}
      defaultButtonText={selectLabel}
      statusBarTranslucent={true}
      renderDropdownIcon={() => (
        <MaterialIcons name="keyboard-arrow-down" size={24} />
      )}
      {...props}
    />
  );
};

export default DropDown;
