import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {COLORS} from '../constants';
import Icon from 'react-native-vector-icons/Feather';

import {
  ManagerStackNavigator,
  ProfileStackNavigator,
  NotificationStackContainer,
} from './StackNavigator';

const Tab = createBottomTabNavigator();
const homeName = 'HomeManager';
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
        component={ManagerStackNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          console.log(focusedRouteName);
          if (
            focusedRouteName === 'OBookingDetail' ||
            focusedRouteName === 'AddBooking' ||
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
        name="Thông báo"
        component={NotificationStackContainer}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          if (
            focusedRouteName === 'HistoryD' ||
            focusedRouteName === 'OBookingDetail'
          ) {
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
        name={profileName}
        component={ProfileStackNavigator}
        options={({route}) => {
          const focusedRouteName = getFocusedRouteNameFromRoute(route);
          console.log(focusedRouteName);
          if (focusedRouteName === 'StaffManagement') {
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
