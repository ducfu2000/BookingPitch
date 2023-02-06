import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
  FlatList,
  PermissionsAndroid,
  Platform,
  Linking,
  ActivityIndicator,
  Alert,
  Animated,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import baseStyles from '../../../constants/baseCss';
import {COLORS, SIZES} from '../../../constants/theme';
import {ExpandableListView} from 'react-native-expandable-listview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Permissions from 'react-native-permissions';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AuthContext from '../../../context/AuthContext';
import {FloatingAction} from 'react-native-floating-action';
import DropDown from '../../../components/common/DropDown/DropDown';

const ManagerDetail = () => {
  return (
    <View>
      <Text>ManagerDetail</Text>
    </View>
  );
};

export default ManagerDetail;

const styles = StyleSheet.create({});
