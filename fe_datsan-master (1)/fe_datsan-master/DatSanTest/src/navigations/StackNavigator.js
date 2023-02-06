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
        options={{title: 'Danh sách đặt sân'}}
        component={OBookingList}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Thông tin đặt sân'}}
        component={OBookingDetail}
      />
      <Stack.Screen
        name="AddBooking"
        options={{title: 'Thêm đơn đặt sân trực tiếp'}}
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
        options={{title: 'Danh sách đặt sân'}}
        component={OBookingList}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Thông tin đặt sân'}}
        component={OBookingDetail}
      />
      <Stack.Screen
        name="AddBooking"
        options={{title: 'Thêm đơn đặt sân trực tiếp'}}
        component={AddBooking}
      />
      <Stack.Screen
        name="Notification"
        options={{title: 'Thông báo', headerShown: false}}
        component={NotificationStackContainer}
      />
      <Stack.Screen
        name={'BankManagement'}
        options={{title: 'Quản lý tài khoản ngân hàng', headerShown: false}}
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
          title: 'Lịch',
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
        options={{title: 'Danh sách đặt sân'}}
        component={OBookingList}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Thông tin đặt sân'}}
        component={OBookingDetail}
      />
      <Stack.Screen
        name="Notification"
        options={{title: 'Thông báo', headerShown: false}}
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
        options={{title: 'Thêm/sửa hệ thống sân'}}
        component={AddPitchSystem}
      />
      <Stack.Screen
        name="PitchManagementSC"
        options={{title: 'Quản lý sân'}}
        component={PitchManagement}
      />
      <Stack.Screen
        name="RatingList"
        options={{title: 'Đánh giá'}}
        component={RatingList}
      />
      <Stack.Screen
        name="AddPitch"
        options={{title: 'Thêm sân'}}
        component={AddPitch}
      />
      <Stack.Screen
        name="AddPrice"
        options={{title: 'Thêm giá theo khung giờ'}}
        component={AddPrice}
      />
      <Stack.Screen
        name="AddAddress"
        options={{title: 'Thêm địa chỉ'}}
        component={AddAddress}
      />
      <Stack.Screen
        name="Notification"
        options={{title: 'Thông báo', headerShown: false}}
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
        options={{title: 'Thông báo', headerShown: false}}
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
        options={{title: 'Quản lý nhân viên'}}
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
        options={{title: 'Tôi', headerShown: false}}
      />
      <Stack.Screen
        name="AccountInfo"
        component={AccountInfo}
        options={{title: 'Thông tin tài khoản', headerShown: false}}
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
        options={{title: 'Danh sách đặt sân'}}
        component={OBookingList}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Thông tin đặt sân'}}
        component={OBookingDetail}
      />
      <Stack.Screen
        name="AddBooking"
        options={{title: 'Thêm đơn đặt sân trực tiếp'}}
        component={AddBooking}
      />
      <Stack.Screen
        name="History"
        options={{title: 'Lịch sử đặt sân'}}
        component={HistoryBookingNavigatorAw}
      />
      <Stack.Screen
        name="HistoryPe"
        options={{title: 'Lịch sử đặt sân'}}
        component={HistoryBookingNavigatorPe}
      />
      <Stack.Screen
        name="HistoryCf"
        options={{title: 'Lịch sử đặt sân'}}
        component={HistoryBookingNavigatorCf}
      />
      <Stack.Screen
        name="HistoryRj"
        options={{title: 'Lịch sử đặt sân'}}
        component={HistoryBookingNavigatorRj}
      />
      <Stack.Screen
        name="HistoryD"
        options={{title: 'Thông tin lịch sử đặt sân'}}
        component={HistoryDetail}
      />
      <Stack.Screen
        name="FeedBackList"
        options={{title: 'Thông tin các sân đã đặt'}}
        component={Feedback}
      />
      <Stack.Screen
        name="FeedBackListDetails"
        options={{title: 'Gửi đánh giá'}}
        component={FeedbackDetails}
      />

      <Stack.Screen
        name={'BankManagement'}
        options={{title: 'Quản lý tài khoản ngân hàng', headerShown: false}}
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
        options={{title: 'Thông tin hệ thống sân'}}
        component={Details}
      />
      <Stack.Screen
        name={detailsPitch}
        options={{title: 'Thông tin sân'}}
        component={DetailsPitch}
      />
      <Stack.Screen
        name={booking}
        options={{title: 'Đặt sân'}}
        component={Booking}
      />
      <Stack.Screen
        name={'Calendar'}
        options={{title: 'Lịch'}}
        component={Calendar}
      />
      <Stack.Screen
        name={bookingDetail}
        options={{title: 'Xác nhận đặt sân'}}
        component={BookingDetail}
      />
      <Stack.Screen
        name="FeedBackEditor"
        options={{title: 'Sửa đánh giá'}}
        component={FeedBackEditor}
      />
      <Stack.Screen
        name={'Payment'}
        options={{title: 'Thanh toán'}}
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
          title: 'Thông báo',
        }}
        component={NotificationManagement}
      />
      <Stack.Screen
        name="HistoryD"
        options={{title: 'Thông tin đặt sân'}}
        component={HistoryDetail}
      />
      <Stack.Screen
        name="OBookingDetail"
        options={{title: 'Thông tin đặt sân'}}
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
          title: 'Đội của tôi',
          /* headerShown: false, */
        }}
        component={MyTeam}
      />
      <Stack.Screen
        name={'AddTeam'}
        options={{
          title: 'Tạo đội',
          /* headerShown: false, */
        }}
        component={AddTeam}
      />
      <Stack.Screen
        name={'TeamDetail'}
        options={{
          title: 'Thành viên nhóm',
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
          title: 'Quản lý tài khoản ngân hàng',
        }}
        component={BankManagement}
      />
      <Stack.Screen
        name={'AddBankInfo'}
        options={{
          title: 'Thêm tài khoản ngân hàng',
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
        options={{title: 'Đặt sân'}}
        component={Booking}
      />
      <Stack.Screen
        name={bookingDetail}
        options={{title: 'Xác nhận đặt sân'}}
        component={BookingDetail}
      />
      <Stack.Screen
        name={payment}
        options={{title: 'Thanh toán'}}
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
