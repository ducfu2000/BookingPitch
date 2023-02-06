import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {StyleSheet, Image, Text} from 'react-native';
import {Details, DetailsPitch, Payment, HomeForEndUser} from '../screens';
import Calendar from '../screens/Tenant/BookingScreen/Calendar';
import Booking from '../screens/Tenant/BookingScreen/Booking';
import BookingDetail from '../screens/Tenant/BookingScreen/BookingDetail';
import SearchCity from '../screens/Tenant/SearchCityScreen/SearchCity';
const Stack = createNativeStackNavigator();

// Home for end user
const SearchC = 'SearchC';
const detailsName = 'PitchDetails';
const Book = 'Booking';
const BookDetail = 'BookingDetail';
const detailsPitch = 'DetailPitch';

const MainStackSearchNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={SearchC}
      screenOptions={{headerShown: true, headerTitleAlign: 'center'}}
    >
      <Stack.Screen
        name={SearchC}
        options={{
          headerTitle: () => (
            <Image
              style={styles.headerLogo}
              source={require('../assets/images/datsan.png')}
            />
          ),
        }}
        component={SearchCity}
      />
      <Stack.Screen
        name={'detailsName'}
        options={{title: 'Thông tin hệ thống sân'}}
        component={Details}
      />
      <Stack.Screen
        name={detailsPitch}
        options={{title: 'Thông tin sân'}}
        component={DetailsPitch}
      />
      <Stack.Screen
        name={BookDetail}
        options={{title: 'Xác nhận đặt sân'}}
        component={BookingDetail}
      />
      <Stack.Screen
        name={'Calendar'}
        options={{title: 'Lịch'}}
        component={Calendar}
      />
      <Stack.Screen
        name={Book}
        options={{title: 'Đặt sân'}}
        component={Booking}
      />
      <Stack.Screen
        name={'Payment'}
        options={{title: 'Thanh toán'}}
        component={Payment}
      />
    </Stack.Navigator>
  );
};

export {MainStackSearchNavigator};
const styles = StyleSheet.create({
  headerLogo: {
    width: 160,
    height: 32,
  },
});
