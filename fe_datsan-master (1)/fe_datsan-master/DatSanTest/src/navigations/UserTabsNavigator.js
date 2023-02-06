import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {COLORS} from '../constants';
import Icon from 'react-native-vector-icons/Feather';

import {
  MainStackUNavigator,
  CalendarStackNavigator,
  PitchSystemManagementStackNavigator,
  RevenueManagementStackNavigator,
  ProfileStackNavigator,
} from './StackNavigator';

const Tab = createBottomTabNavigator();
const homeName = 'Home';
const calendarDetailsName = 'CalendarDetails';
const pitchManagementName = 'PitchManagement';
const revenueManagementName = 'RevenueManagement';
const profileName = 'Profile';

const BottomTabsForUserNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
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
        name={homeName}
        component={MainStackUNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'PitchManagement' ||
            focusedRouteName === 'AddPitch' ||
            focusedRouteName === 'AddPrice' ||
            focusedRouteName === 'AddSystemPitch' ||
            focusedRouteName === 'AddAddress' ||
            focusedRouteName === 'AddBooking' ||
            focusedRouteName === 'OBookingDetail' ||
            focusedRouteName === 'Notification' ||
            focusedRouteName === 'BankManagement' ||
            focusedRouteName === 'OBookingList'
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
        name={calendarDetailsName}
        component={CalendarStackNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'OBookingDetail' ||
            focusedRouteName === 'Notification'
          ) {
            return {
              headerShown: false,
              tabBarStyle: {display: 'none'},
            };
          }

          return {
            title: 'Lịch',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="calendar" size={size} color={color} />
            ),
          };
        }}
      />
      <Tab.Screen
        name={pitchManagementName}
        component={PitchSystemManagementStackNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'PitchManagementSC' ||
            focusedRouteName === 'AddPitch' ||
            focusedRouteName === 'AddPrice' ||
            focusedRouteName === 'AddSystemPitch' ||
            focusedRouteName === 'AddAddress' ||
            focusedRouteName === 'Notification' ||
            focusedRouteName === 'RatingList' ||
            focusedRouteName === 'OBookingDetail'
          ) {
            return {
              headerShown: false,
              tabBarStyle: {display: 'none'},
            };
          }

          return {
            title: 'Quản lý sân',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="edit-3" size={size} color={color} />
            ),
          };
        }}
      />
      <Tab.Screen
        name={revenueManagementName}
        component={RevenueManagementStackNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'Notification' ||
            focusedRouteName === 'OBookingDetail'
          ) {
            return {
              headerShown: false,
              tabBarStyle: {display: 'none'},
            };
          }

          return {
            title: 'Doanh thu',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="bar-chart-2" size={size} color={color} />
            ),
          };
        }}
      />
      <Tab.Screen
        name={profileName}
        component={ProfileStackNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'StaffManagement' ||
            focusedRouteName === 'AccountInfo' ||
            focusedRouteName === 'OBookingList' ||
            focusedRouteName === 'BankManagement' ||
            focusedRouteName === 'ChangePassword' ||
            focusedRouteName === 'AddBooking'
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

export default BottomTabsForUserNavigator;
