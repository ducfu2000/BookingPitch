import {StyleSheet, Image, Pressable} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Details,
  HomeForEndUser,
  AccountInfo,
  BankManagement,
  AddBankInfo,
  MyTeam,
  Booking,
  BookingDetail,
  Payment,
  DetailsPitch,
  Messaging,
  HomeForUser,
  OBookingList,
  OBookingDetail,
  PitchSystemManagement,
  PitchManagement,
  RevenueManagement,
  CalendarDetails,
  NotificationManagement,
  StaffManagement,
  ManagerHome,
  AddTeam,
  TeamDetail,
  AddBooking,
  Calendar,
  FeedBackEditor,
  ChangePassword,
  RatingList,
} from '../screens';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS} from '../constants/theme';

import ProfileSC from '../screens/Common/ProfileScreen/index';
import {
  HistoryBookingNavigatorAw,
  HistoryBookingNavigatorPe,
  HistoryBookingNavigatorCf,
  HistoryBookingNavigatorRj,
} from './HistoryBookingNavigator';
import HistoryDetail from '../screens/Tenant/HistoryBookingScreen/DetailHistoryBooking';
import {
  AddAddress,
  AddPitch,
  AddPitchSystem,
  AddPrice,
} from '../screens/Owner/CRUDSystemPitchScreen/';
import Feedback from '../screens/Tenant/FeedBackScreen/Feedback';
import FeedbackDetails from '../screens/Tenant/FeedBackScreen/FeedbackDetail';
const Stack = createNativeStackNavigator();

// Screen names
const homeName = 'HomeForUser';
const calendarDetailsName = 'CalendarDetailsSC';
const pitchManagementName = 'PitchSystemManagementSC';
const revenueManagementName = 'RevenueManagementSC';

const homeManagerName = 'HomeManagerSC';
// Home for end user
const homeEndUserName = 'HomeForEndUser';
const detailsName = 'PitchDetails';
const booking = 'Booking';
const bookingDetail = 'BookingDetail';
const detailsPitch = 'DetailPitch';
const payment = 'Payment';
const history = 'HistoryBookingNavigatorAw';
const historyPe = 'HistoryBookingNavigatorPe';
const historyCf = 'HistoryBookingNavigatorCf';
const historyRj = 'HistoryBookingNavigatorRj';
const HistoryD = 'HistoryDetail';
const FeedbackList = 'FeedBack';

const ManagerStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={homeManagerName}
      screenOptions={{headerTitleAlign: 'center'}}
    >
      <Stack.Screen
        name={homeManagerName}
        options={{
          headerTitle: () => (
            <Image
              style={styles.headerLogo}
              source={require('../assets/images/datsan.png')}
            />
          ),
        }}
        component={ManagerHome}
      />
      <Stack.Screen
        name="OBookingList"
        options={{title: 'Danh s??ch ?????t s??n'}}
        component={OBookingList}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Th??ng tin ?????t s??n'}}
        component={OBookingDetail}
      />
      <Stack.Screen
        name="AddBooking"
        options={{title: 'Th??m ????n ?????t s??n tr???c ti???p'}}
        component={AddBooking}
      />
    </Stack.Navigator>
  );
};
const MainStackUNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={homeName}
      screenOptions={{headerTitleAlign: 'center'}}
    >
      <Stack.Screen
        name={homeName}
        options={({navigation}) => ({
          headerTitle: () => (
            <Image
              style={styles.headerLogo}
              source={require('../assets/images/datsan.png')}
            />
          ),
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Notification')}>
              <Feather
                name="bell"
                size={26}
                style={{
                  padding: 8,
                  borderRadius: 50,
                  color: COLORS.primaryColor,
                }}
              />
            </Pressable>
          ),
        })}
        component={HomeForUser}
      />
      <Stack.Screen
        name="OBookingList"
        options={{title: 'Danh s??ch ?????t s??n'}}
        component={OBookingList}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Th??ng tin ?????t s??n'}}
        component={OBookingDetail}
      />
      <Stack.Screen
        name="AddBooking"
        options={{title: 'Th??m ????n ?????t s??n tr???c ti???p'}}
        component={AddBooking}
      />
      <Stack.Screen
        name="Notification"
        options={{title: 'Th??ng b??o', headerShown: false}}
        component={NotificationStackContainer}
      />
      <Stack.Screen
        name={'BankManagement'}
        options={{title: 'Qu???n l?? t??i kho???n ng??n h??ng', headerShown: false}}
        component={BankStackContainer}
      />
      <Stack.Screen
        name={'PitchSystems'}
        options={{title: '', headerShown: false}}
        component={PitchSystemManagementStackNavigator}
      />
    </Stack.Navigator>
  );
};

const CalendarStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={calendarDetailsName}
      screenOptions={{headerTitleAlign: 'center'}}
    >
      <Stack.Screen
        name={calendarDetailsName}
        component={CalendarDetails}
        options={({navigation}) => ({
          title: 'L???ch',
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Notification')}>
              <Feather
                name="bell"
                size={26}
                style={{
                  padding: 8,
                  borderRadius: 50,
                  color: COLORS.primaryColor,
                }}
              />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="OBookingList"
        options={{title: 'Danh s??ch ?????t s??n'}}
        component={OBookingList}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Th??ng tin ?????t s??n'}}
        component={OBookingDetail}
      />
      <Stack.Screen
        name="Notification"
        options={{title: 'Th??ng b??o', headerShown: false}}
        component={NotificationStackContainer}
      />
    </Stack.Navigator>
  );
};

const PitchSystemManagementStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={pitchManagementName}
      screenOptions={{headerTitleAlign: 'center'}}
    >
      <Stack.Screen
        name={pitchManagementName}
        component={PitchSystemManagement}
        options={({navigation}) => ({
          headerTitle: () => (
            <Image
              style={styles.headerLogo}
              source={require('../assets/images/datsan.png')}
            />
          ),
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Notification')}>
              <Feather
                name="bell"
                size={26}
                style={{
                  padding: 8,
                  borderRadius: 50,
                  color: COLORS.primaryColor,
                }}
              />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="AddSystemPitch"
        options={{title: 'Th??m/s???a h??? th???ng s??n'}}
        component={AddPitchSystem}
      />
      <Stack.Screen
        name="PitchManagementSC"
        options={{title: 'Qu???n l?? s??n'}}
        component={PitchManagement}
      />
      <Stack.Screen
        name="RatingList"
        options={{title: '????nh gi??'}}
        component={RatingList}
      />
      <Stack.Screen
        name="AddPitch"
        options={{title: 'Th??m s??n'}}
        component={AddPitch}
      />
      <Stack.Screen
        name="AddPrice"
        options={{title: 'Th??m gi?? theo khung gi???'}}
        component={AddPrice}
      />
      <Stack.Screen
        name="AddAddress"
        options={{title: 'Th??m ?????a ch???'}}
        component={AddAddress}
      />
      <Stack.Screen
        name="Notification"
        options={{title: 'Th??ng b??o', headerShown: false}}
        component={NotificationStackContainer}
      />
    </Stack.Navigator>
  );
};

const RevenueManagementStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
      <Stack.Screen
        name={revenueManagementName}
        component={RevenueManagement}
        options={({navigation}) => ({
          title: 'Doanh thu',
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Notification')}>
              <Feather
                name="bell"
                size={26}
                style={{
                  padding: 8,
                  borderRadius: 50,
                  color: COLORS.primaryColor,
                }}
              />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Notification"
        options={{title: 'Th??ng b??o', headerShown: false}}
        component={NotificationStackContainer}
      />
    </Stack.Navigator>
  );
};

const StaffManagementStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerTitleAlign: 'center'}}
      initialRouteName="StaffManagementScreen"
    >
      <Stack.Screen
        name={'StaffManagementScreen'}
        component={StaffManagement}
        options={{title: 'Qu???n l?? nh??n vi??n'}}
      />
    </Stack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={'ProfileSC'}
      screenOptions={{headerTitleAlign: 'center'}}
    >
      <Stack.Screen
        name="ProfileSC"
        component={ProfileSC}
        options={{title: 'T??i', headerShown: false}}
      />
      <Stack.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{title: 'Th??ng tin t??i kho???n', headerShown: false}}
      />

      <Stack.Screen
        name={'StaffManagement'}
        options={{title: '', headerShown: false}}
        component={StaffManagementStackNavigator}
      />
      <Stack.Screen
        name="ChangePassword"
        options={{
          headerTitle: () => (
            <Image
              style={styles.headerLogo}
              source={require('../assets/images/datsan.png')}
            />
          ),
        }}
        component={ChangePassword}
      />
      <Stack.Screen
        name="OBookingList"
        options={{title: 'Danh s??ch ?????t s??n'}}
        component={OBookingList}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Th??ng tin ?????t s??n'}}
        component={OBookingDetail}
      />
      <Stack.Screen
        name="AddBooking"
        options={{title: 'Th??m ????n ?????t s??n tr???c ti???p'}}
        component={AddBooking}
      />
      <Stack.Screen
        name="History"
        options={{title: 'L???ch s??? ?????t s??n'}}
        component={HistoryBookingNavigatorAw}
      />
      <Stack.Screen
        name="HistoryPe"
        options={{title: 'L???ch s??? ?????t s??n'}}
        component={HistoryBookingNavigatorPe}
      />
      <Stack.Screen
        name="HistoryCf"
        options={{title: 'L???ch s??? ?????t s??n'}}
        component={HistoryBookingNavigatorCf}
      />
      <Stack.Screen
        name="HistoryRj"
        options={{title: 'L???ch s??? ?????t s??n'}}
        component={HistoryBookingNavigatorRj}
      />
      <Stack.Screen
        name="HistoryD"
        options={{title: 'Th??ng tin l???ch s??? ?????t s??n'}}
        component={HistoryDetail}
      />
      <Stack.Screen
        name="FeedBackList"
        options={{title: 'Th??ng tin c??c s??n ???? ?????t'}}
        component={Feedback}
      />
      <Stack.Screen
        name="FeedBackListDetails"
        options={{title: 'G???i ????nh gi??'}}
        component={FeedbackDetails}
      />

      <Stack.Screen
        name={'BankManagement'}
        options={{title: 'Qu???n l?? t??i kho???n ng??n h??ng', headerShown: false}}
        component={BankStackContainer}
      />
    </Stack.Navigator>
  );
};

const MainStackEUNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={homeEndUserName}
      screenOptions={{headerTitleAlign: 'center'}}
    >
      <Stack.Screen
        name={homeEndUserName}
        options={({navigation}) => ({
          headerTitle: () => (
            <Image
              style={styles.headerLogo}
              source={require('../assets/images/datsan.png')}
            />
          ),
        })}
        component={HomeForEndUser}
      />
      <Stack.Screen
        name={detailsName}
        options={{title: 'Th??ng tin h??? th???ng s??n'}}
        component={Details}
      />
      <Stack.Screen
        name={detailsPitch}
        options={{title: 'Th??ng tin s??n'}}
        component={DetailsPitch}
      />
      <Stack.Screen
        name={booking}
        options={{title: '?????t s??n'}}
        component={Booking}
      />
      <Stack.Screen
        name={'Calendar'}
        options={{title: 'L???ch'}}
        component={Calendar}
      />
      <Stack.Screen
        name={bookingDetail}
        options={{title: 'X??c nh???n ?????t s??n'}}
        component={BookingDetail}
      />
      <Stack.Screen
        name="FeedBackEditor"
        options={{title: 'S???a ????nh gi??'}}
        component={FeedBackEditor}
      />
      <Stack.Screen
        name={'Payment'}
        options={{title: 'Thanh to??n'}}
        component={Payment}
      />
    </Stack.Navigator>
  );
};

const NotificationStackContainer = () => {
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
      <Stack.Screen
        name={'NotificationManagement'}
        options={{
          title: 'Th??ng b??o',
        }}
        component={NotificationManagement}
      />
      <Stack.Screen
        name="HistoryD"
        options={{title: 'Th??ng tin ?????t s??n'}}
        component={HistoryDetail}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Th??ng tin ?????t s??n'}}
        component={OBookingDetail}
      />
    </Stack.Navigator>
  );
};

const MyTeamStackContainer = () => {
  return (
    <Stack.Navigator
      initialRouteName={'MyTeam'}
      screenOptions={{headerTitleAlign: 'center'}}
    >
      <Stack.Screen
        name={'MyTeam'}
        options={{
          title: '?????i c???a t??i',
          /* headerShown: false, */
        }}
        component={MyTeam}
      />
      <Stack.Screen
        name={'AddTeam'}
        options={{
          title: 'T???o ?????i',
          /* headerShown: false, */
        }}
        component={AddTeam}
      />
      <Stack.Screen
        name={'TeamDetail'}
        options={{
          title: 'Th??nh vi??n nh??m',
          /* headerShown: false, */
        }}
        component={TeamDetail}
      />
    </Stack.Navigator>
  );
};

const BankStackContainer = () => {
  return (
    <Stack.Navigator
      initialRouteName={'BankList'}
      screenOptions={{headerTitleAlign: 'center'}}
    >
      <Stack.Screen
        name={'BankList'}
        options={{
          title: 'Qu???n l?? t??i kho???n ng??n h??ng',
        }}
        component={BankManagement}
      />
      <Stack.Screen
        name={'AddBankInfo'}
        options={{
          title: 'Th??m t??i kho???n ng??n h??ng',
        }}
        component={AddBankInfo}
      />
    </Stack.Navigator>
  );
};

const BookingPitchStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign: 'center'}}>
      <Stack.Screen
        name={booking}
        options={{title: '?????t s??n'}}
        component={Booking}
      />
      <Stack.Screen
        name={bookingDetail}
        options={{title: 'X??c nh???n ?????t s??n'}}
        component={BookingDetail}
      />
      <Stack.Screen
        name={payment}
        options={{title: 'Thanh to??n'}}
        component={Payment}
      />
    </Stack.Navigator>
  );
};

export {
  MainStackUNavigator,
  ManagerStackNavigator,
  MainStackEUNavigator,
  MyTeamStackContainer,
  CalendarStackNavigator,
  PitchSystemManagementStackNavigator,
  RevenueManagementStackNavigator,
  ProfileStackNavigator,
  NotificationStackContainer,
};

const styles = StyleSheet.create({
  headerLogo: {
    width: 160,
    height: 32,
  },
});
