import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {FloatingAction} from 'react-native-floating-action';
import styles from './styles';

import baseStyles from '../../../constants/baseCss';
import {icons, COLORS, SIZES} from '../../../constants';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Border from '../../../components/Border';
import AuthContext from '../../../context/AuthContext';

const ListBooking = ({route, navigation}) => {
  const {sid, status} = route.params;
  const {host, userToken} = useContext(AuthContext);
  const [bookings, setBookings] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(status);

  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [currentDate, setCurrentDate] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const dateNow = currentYear + '-' + currentMonth + '-' + currentDate;

  const [selectedItem, setSelectedItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log(status, 'status out');
    if (status == 'Awaiting payment') {
      setSelectedItem(0);
    } else if (status == 'Pending') {
      setSelectedItem(1);
    } else if (status == 'Confirmed') {
      setSelectedItem(2);
    } else if (status == 'Rejected') {
      setSelectedItem(3);
    } else {
      setSelectedItem(0);
    }
    const unsubscribe = navigation.addListener('focus', () => {
      getAllBooking(sid, date && date, status ? status : 'Awaiting payment');
    });
    var _date = new Date();
    var curDate = _date.getDate(); //Current Date
    var curMonth = _date.getMonth() + 1; //Current Month
    var curYear = _date.getFullYear(); //Current Year
    setCurrentDate(curDate);
    setCurrentMonth(curMonth);
    setCurrentYear(curYear);
    return unsubscribe;
  }, []);

  const getAllBooking = (
    _sid = null,
    _selectedDate = null,
    _status = null,
    _currentPage = 1,
  ) => {
    console.log(_currentPage, _sid, bookings, _status, _selectedDate);
    console.log(
      `${host}/api/manager/booking/all?${
        _sid == null ? '' : 'sid=' + _sid + '&'
      }date=${_selectedDate.toLocaleDateString(
        'vi-VN',
      )}&status=${_status}&page=${_currentPage}`,
    );
    setIsLoading(true);
    fetch(
      `${host}/api/manager/booking/all?${
        _sid == null ? '' : 'sid=' + _sid + '&'
      }date=${_selectedDate.toLocaleDateString(
        'vi-VN',
      )}&status=${_status}&page=${_currentPage}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
      },
    )
      .then(res => res.json())
      .then(resJson => {
        if (resJson.booking) {
          if (bookings == null || bookings.length == 0) {
            setBookings(resJson.booking);
            console.log(resJson.booking, 'bookings');
          } else if (bookings !== null || bookings.length !== 0) {
            setBookings([...bookings, ...resJson.booking]);
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onChange = (event, _selectedDate) => {
    const currDate = _selectedDate;
    bookings.length = 0;
    setShow(false);
    console.log(currDate);
    setDate(currDate);
    getAllBooking(sid, _selectedDate, currentStatus);
  };

  const showMode = currentMode => {
    if (Platform.OS == 'android') {
      setShow(true);
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onViewBookingDetailsPress = booking => {
    navigation.navigate('OBookingDetail', {
      bookingId: booking.id,
      backScreen: 'OBookingList',
      status: status,
      selectedDate: date,
    });
  };

  // FloatingAction
  const actions = [
    {
      text: 'Thêm các đơn đặt sân trức tiếp',
      icon: (
        <Ionicons
          name="ios-add"
          style={{color: COLORS.primaryColor, fontSize: 30}}
        />
      ),
      name: 'bt_add_booking',
      position: 2,
      color: COLORS.whiteColor,
      margin: 6,
    },
  ];

  const onFloatingActionPress = name => {
    switch (name) {
      case 'bt_add_booking':
        navigation.navigate('AddBooking');
        break;
    }
  };

  const BookingItem = ({bItem}) => {
    return (
      <Pressable
        onPress={() => {
          onViewBookingDetailsPress(bItem);
        }}
        style={{alignItems: 'center'}}
      >
        <View
          style={[
            baseStyles.row,
            baseStyles.centerVertically,
            baseStyles.spaceBetween,
            baseStyles.w90,
          ]}
        >
          <View style={baseStyles.w50}>
            <Text numberOfLines={1}>Sân: {bItem && bItem.pitch}</Text>
            <Text>{bItem && bItem.time}</Text>
          </View>
          <View style={[baseStyles.row, baseStyles.centerVertically]}>
            <Text
              style={[
                baseStyles.mr10,
                {
                  color:
                    bItem.status == 'Pending'
                      ? COLORS.editColor
                      : bItem.status == 'Confirmed'
                      ? COLORS.primaryColor
                      : bItem.status == 'Awaiting payment'
                      ? COLORS.editColor
                      : bItem.status == 'Rejected' && COLORS.dangerColor,
                },
              ]}
            >
              {bItem && bItem.status == 'Pending'
                ? 'Chờ duyệt'
                : bItem.status == 'Confirmed'
                ? 'Đã xác nhận'
                : bItem.status == 'Awaiting payment'
                ? 'Chờ thanh toán'
                : bItem.status == 'Rejected' && 'Đã hủy'}
            </Text>

            <Feather name="eye" size={24} style={{color: COLORS.editColor}} />
          </View>
        </View>
        <Border />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      <View style={styles.bookingContainer}>
        <View
          style={[
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.centerVertically,
          ]}
        >
          <Text>Chọn ngày</Text>
          <Pressable onPress={showDatepicker}>
            <Text style={styles.textDate}>
              {date.toLocaleDateString('vi-VN')}{' '}
              <Feather style={baseStyles.ml5} name="calendar" size={18} />
            </Text>
          </Pressable>
        </View>
        <Border />
        <View
          style={[
            baseStyles.row,
            baseStyles.centerVertically,
            baseStyles.spaceBetween,
            baseStyles.mb10,
          ]}
        >
          <View
            style={[styles.itemType, selectedItem == 0 && styles.selectedItem]}
          >
            <Text
              onPress={() => {
                bookings.length = 0;
                setCurrentPage(1);
                setSelectedItem(0);
                setCurrentStatus('Awaiting payment');
                getAllBooking(sid, date, 'Awaiting payment');
              }}
            >
              Chờ thanh toán
            </Text>
          </View>
          <View
            style={[styles.itemType, selectedItem == 1 && styles.selectedItem]}
          >
            <Text
              onPress={() => {
                bookings.length = 0;
                setCurrentPage(1);
                setSelectedItem(1);
                setCurrentStatus('Pending');
                getAllBooking(sid, date, 'Pending');
              }}
            >
              Chờ xác nhận
            </Text>
          </View>
          <View
            style={[styles.itemType, selectedItem == 2 && styles.selectedItem]}
          >
            <Text
              onPress={() => {
                bookings.length = 0;
                setCurrentPage(1);
                setSelectedItem(2);
                setCurrentStatus('Confirmed');
                getAllBooking(sid, date, 'Confirmed');
              }}
            >
              Đã duyệt
            </Text>
          </View>

          <View
            style={[styles.itemType, selectedItem == 3 && styles.selectedItem]}
          >
            <Text
              onPress={() => {
                bookings.length = 0;
                setCurrentPage(1);
                setSelectedItem(3);
                setCurrentStatus('Rejected');
                getAllBooking(sid, date, 'Rejected');
              }}
            >
              Đã hủy
            </Text>
          </View>
        </View>

        {bookings && bookings.length == 0 && selectedItem == 0 && (
          <Text>Hiện tại chưa có sân nào được đặt.</Text>
        )}
        {bookings && bookings.length == 0 && selectedItem == 1 && (
          <Text>Hiện tại chưa có sân nào được đặt.</Text>
        )}
        {bookings && bookings.length == 0 && selectedItem == 2 && (
          <Text>Hiện tại chưa có sân nào được xác nhận.</Text>
        )}
        {bookings && bookings.length == 0 && selectedItem == 3 && (
          <Text>Hiện tại chưa có sân nào đã hủy.</Text>
        )}
        {bookings && (
          <FlatList
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            data={bookings}
            renderItem={({item}) => <BookingItem bItem={item} />}
            keyExtractor={item => item.id}
          />
        )}
        {bookings && bookings.length >= 9 && bookings.length % 9 == 0 && (
          <TouchableOpacity
            onPress={() => {
              getAllBooking(sid, date, currentStatus, currentPage + 1);
              setCurrentPage(currentPage + 1);
            }}
            style={[
              baseStyles.centerVertically,
              baseStyles.row,
              baseStyles.w100,
              baseStyles.centerHorizontal,
            ]}
          >
            <Text>Xem thêm </Text>
            {isLoading && bookings.length !== 0 && (
              <ActivityIndicator size="small" animating />
            )}
          </TouchableOpacity>
        )}
        {isLoading && !bookings && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" animating />
          </View>
        )}
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
      <FloatingAction
        position={'right'}
        color={COLORS.primaryColor}
        actions={actions}
        onPressItem={name => {
          onFloatingActionPress(name);
        }}
        shadow={{
          shadowOpacity: 0.35,
          shadowOffset: {width: 0, height: 5},
          shadowColor: '#000000',
          shadowRadius: 3,
        }}
        overlayColor={COLORS.overlayColor}
        buttonSize={50}
        iconWidth={20}
        iconHeight={20}
        distanceToEdge={20}
      />
    </SafeAreaView>
  );
};

export default ListBooking;
