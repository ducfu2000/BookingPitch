import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
import HistoryBooking from '../screens/Tenant/HistoryBookingScreen/HistoryBooking';
import HistoryBookingP from '../screens/Tenant/HistoryBookingScreen/HistoryPending';
import HistoryBookingC from '../screens/Tenant/HistoryBookingScreen/HistoryConfirm';
import HistoryBookingR from '../screens/Tenant/HistoryBookingScreen/HistoryReject';
import HistoryBookingWC from '../screens/Tenant/HistoryBookingScreen/HistoryBookingWillConfirm';

const HistoryBookingNavigatorAw = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12, width: '100%', bottom: 10},
        tabBarStyle: {height: 30},
        tabBarScrollEnabled: true,
      }}
      initialRouteName="Chờ thanh toán"
    >
      <Tab.Screen component={HistoryBooking} name="Chờ thanh toán" />
      <Tab.Screen component={HistoryBookingP} name="Chờ xác nhận" />
      <Tab.Screen component={HistoryBookingC} name="Đã đá " />
      <Tab.Screen component={HistoryBookingWC} name="Chưa đá " />
      <Tab.Screen component={HistoryBookingR} name="Đã huỷ" />
    </Tab.Navigator>
  );
};
const HistoryBookingNavigatorPe = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12, width: '100%', bottom: 10},
        tabBarStyle: {height: 30},
        tabBarScrollEnabled: true,
      }}
      initialRouteName="Chờ xác nhận"
    >
      <Tab.Screen component={HistoryBooking} name="Chờ thanh toán" />
      <Tab.Screen component={HistoryBookingP} name="Chờ xác nhận" />
      <Tab.Screen component={HistoryBookingC} name="Đã đá" />
      <Tab.Screen component={HistoryBookingWC} name="Chưa đá" />
      <Tab.Screen component={HistoryBookingR} name="Đã huỷ" />
    </Tab.Navigator>
  );
};
const HistoryBookingNavigatorCf = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12, width: '100%', bottom: 10},
        tabBarStyle: {height: 30},
        tabBarScrollEnabled: true,
      }}
      initialRouteName="Đã đá"
    >
      <Tab.Screen component={HistoryBooking} name="Chờ thanh toán" />
      <Tab.Screen component={HistoryBookingP} name="Chờ xác nhận" />
      <Tab.Screen component={HistoryBookingC} name="Đã đá" />
      <Tab.Screen component={HistoryBookingWC} name="Chưa đá" />
      <Tab.Screen component={HistoryBookingR} name="Đã huỷ" />
    </Tab.Navigator>
  );
};
const HistoryBookingNavigatorRj = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12, width: '100%', bottom: 10},
        tabBarStyle: {height: 30},
        tabBarScrollEnabled: true,
      }}
      initialRouteName="Đã huỷ"
    >
      <Tab.Screen component={HistoryBooking} name="Chờ thanh toán" />
      <Tab.Screen component={HistoryBookingP} name="Chờ xác nhận" />
      <Tab.Screen component={HistoryBookingC} name="Đã đá" />
      <Tab.Screen component={HistoryBookingWC} name="Chưa đá" />
      <Tab.Screen component={HistoryBookingR} name="Đã huỷ" />
    </Tab.Navigator>
  );
};
export {
  HistoryBookingNavigatorAw,
  HistoryBookingNavigatorPe,
  HistoryBookingNavigatorRj,
  HistoryBookingNavigatorCf,
};
