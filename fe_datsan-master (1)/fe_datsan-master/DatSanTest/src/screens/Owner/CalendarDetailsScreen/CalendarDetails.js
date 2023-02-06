import {
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
  View,
  Text,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';

import {SIZES, COLORS} from '../../../constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from 'react-native-vector-icons/Feather';

import AuthContext from '../../../context/AuthContext';
import EventCalendar from 'react-native-events-calendar';

const CalendarDetailsScreen = ({navigation}) => {
  const {host, userToken, currentRole} = useContext(AuthContext);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllBooking();
    });
    return unsubscribe;
  });

  const onChange = (event, selectedDate) => {
    setShow(false);
    setDate(selectedDate);
    console.log(selectedDate);
    getAllBooking(selectedDate);
  };

  const showMode = currentMode => {
    if (Platform.OS == 'android') {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const eventClicked = event => {
    if (currentRole !== 'tenant') {
      navigation.navigate('OBookingDetail', {
        bookingId: event.id,
        backScreen: 'CalendarDetails',
      });
    } else {
      Alert.alert('Thêm tài khoản', 'Khung giờ này đã có người đặt', [
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ]);
    }
  };

  const formatDate = _date => {
    var dateNow = new Date(_date);
    // Get year, month, and day part from the date
    var year = dateNow.toLocaleString('default', {year: 'numeric'});
    var month = dateNow.toLocaleString('default', {month: '2-digit'});
    var day = dateNow.toLocaleString('default', {day: '2-digit'});
    // Generate yyyy-mm-dd date string
    return year + '-' + month + '-' + day;
  };

  const getAllBooking = (_date = new Date()) => {
    setIsLoading(true);
    console.log(
      `${host}/api/manager/booking/all?date=${_date.toLocaleDateString(
        'vi-VN',
      )}`,
    );
    fetch(`${host}/api/manager/booking/all`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        const _events = [];
        let bookings = resJson.booking;
        if (resJson.booking) {
          bookings.forEach(booking => {
            _events.push({
              id: booking.id,
              color:
                booking.status == 'Pending'
                  ? COLORS.editColor
                  : booking.status == 'Confirmed'
                  ? COLORS.primaryColor
                  : booking.status == 'Awaiting payment'
                  ? COLORS.editColor
                  : booking.status == 'Rejected' && COLORS.dangerColor,
              status:
                booking.status == 'Pending'
                  ? 'Chờ xác nhận'
                  : booking.status == 'Confirmed'
                  ? 'Đã xác nhận'
                  : booking.status == 'Awaiting payment'
                  ? 'Chờ thanh toán'
                  : booking.status == 'Rejected' && 'Đã hủy',
              start: `${booking.rentDate} ${booking.time.split(' - ')[0]}`,
              end: `${booking.rentDate} ${booking.time.split(' - ')[1]}`,
              title: booking.pitch,
              summary: booking.price,
              orderDate: new Date(booking.updatedAt).toLocaleDateString(
                'vi-VN',
              ),
            });
          });
        }
        console.log(_events);
        setEvents(_events);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ScrollView>
      <SafeAreaView style={baseStyles.root}>
        {/* <Pressable
          style={[styles.textInput, baseStyles.left]}
          onPress={() => showMode('date')}
        >
          <TextInput
            style={{color: '#000'}}
            placeholder="Chọn ngày"
            value={date.toLocaleDateString('vi-VN')}
            editable={false}
          />
        </Pressable> */}
        {events && !isLoading && (
          <EventCalendar
            style={{padding: 20}}
            events={events}
            width={SIZES.width - 40}
            renderEvent={event => (
              <Pressable
                onPress={() => eventClicked(event)}
                style={{
                  flex: 1,
                  padding: 5,
                  backgroundColor: event.color,
                  width: '100%',
                  height: '100%',
                }}
              >
                <View>
                  <Text style={[baseStyles.textBold, baseStyles.fontSize16]}>
                    Sân {event.title}
                  </Text>
                  <Text
                    style={{color: 'white', fontSize: 14, fontWeight: 'bold'}}
                  >
                    {new Date(event.start).toLocaleTimeString('vi-VN') +
                      ' >> ' +
                      new Date(event.end).toLocaleTimeString('vi-VN')}
                  </Text>
                  <View style={[baseStyles.row, baseStyles.centerVertically]}>
                    <Text style={[baseStyles.textBold, baseStyles.fontSize14]}>
                      Ngày tạo đơn: {event.orderDate}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
            start={4}
            end={24}
            formatHeader="DD-MM-YYYY"
            initDate={formatDate(date)}
            scrollToFirst
            format24h={true}
          />
        )}
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default CalendarDetailsScreen;
