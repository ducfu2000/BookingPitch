import React from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

import {Details, HomeForEndUser, Profile, Search} from '../screens/index';
import {
  MainStackEUNavigator,
  ProfileStackNavigator,
  MyTeamStackContainer,
  NotificationStackContainer,
} from './StackNavigator';

import {COLORS} from '../constants';
import {MainStackSearchNavigator} from './SearchNavigator';
import Icon from 'react-native-vector-icons/Feather';
import baseStyles from '../constants/baseCss';
import FontAwesome, {
  SolidIcons,
  RegularIcons,
  BrandIcons,
} from 'react-native-fontawesome';

const Tab = createBottomTabNavigator();

const homeEndUserName = 'HomeForEndUser';
const detailsName = 'PitchDetails';
const CustomTab = ({children, onPress}) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 50,
        height: 20,
        borderRadius: 35,
        backgroundColor: '#32f45',
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);
const BottomTabsForEndUserNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={'HomeForEndUser'}
      screenOptions={{
        tabBarActiveTintColor: COLORS.primaryColor,
        tabBarInactiveTintColor: COLORS.grayColor,
        tabBarLabelStyle: {paddingBottom: 8, fontSize: 12},
        tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
        tabBarStyle: {
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="HomeForEndUser"
        component={MainStackEUNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'Booking' ||
            focusedRouteName === 'DetailPitch' ||
            focusedRouteName === 'PitchDetails' ||
            focusedRouteName === 'BookingDetail' ||
            focusedRouteName === 'Payment' ||
            focusedRouteName === 'Calendar'
          ) {
            return {
              headerShown: false,
              tabBarStyle: {display: 'none'},
            };
          }
          return {
            title: 'Trang chủ',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="home" size={size} color={color} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="Đội của tôi"
        component={MyTeamStackContainer}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'AddTeam' ||
            focusedRouteName === 'TeamDetail'
          ) {
            return {
              headerShown: false,
              tabBarStyle: {display: 'none'},
            };
          }

          return {
            title: 'Đội của tôi',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="users" size={size} color={color} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="Search"
        component={MainStackSearchNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'Booking' ||
            focusedRouteName === 'DetailPitch' ||
            focusedRouteName === 'PitchDetails' ||
            focusedRouteName === 'BookingDetail' ||
            focusedRouteName === 'Payment' ||
            focusedRouteName === 'Calendar'
          ) {
            return {
              headerShown: false,
              tabBarStyle: {display: 'none'},
            };
          }
          return {
            title: 'Tìm kiếm sân',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <View style={styles.view}>
                <Icon name="search" size={32} color={color} />
              </View>
            ),
          };
        }}
      />
      <Tab.Screen
        name="Thông báo"
        component={NotificationStackContainer}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (focusedRouteName === 'HistoryD') {
            return {
              headerShown: false,
              tabBarStyle: {display: 'none'},
            };
          }

          return {
            title: 'Thông báo',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="bell" size={size} color={color} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="Tôi"
        component={ProfileStackNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'History' ||
            focusedRouteName === 'HistoryPe' ||
            focusedRouteName === 'HistoryCf' ||
            focusedRouteName === 'HistoryRj' ||
            focusedRouteName === 'FeedBackList' ||
            focusedRouteName === 'FeedBackListDetails' ||
            focusedRouteName === 'AccountInfo' ||
            focusedRouteName === 'HistoryD'
          ) {
            return {
              headerShown: false,
              tabBarStyle: {display: 'none'},
            };
          }
          return {
            title: 'Tôi',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="user" size={size} color={color} />
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1.5,
    shadowRadius: 3.5,
    elevation: 5,
  },
  view: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    top: -15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.lightGrayColor,
    backgroundColor: COLORS.whiteColor,
  },
});

export default BottomTabsForEndUserNavigator;
