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

import AuthContext from '../../../context/AuthContext';
import EventCalendar from 'react-native-events-calendar';

const Calendar = ({route, navigation}) => {
  const {pitchId, dateBooking} = route.params;
  const {host, userToken} = useContext(AuthContext);
  const [date, setDate] = useState(new Date());

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllBooking(
        dateBooking ? dateBooking : new Date().toLocaleDateString('vi-VN'),
      );
    });
    return unsubscribe;
  });

  const formatDate = _date => {
    var dateNow = new Date(_date);
    // Get year, month, and day part from the date
    var year = dateNow.toLocaleString('default', {year: 'numeric'});
    var month = dateNow.toLocaleString('default', {month: '2-digit'});
    var day = dateNow.toLocaleString('default', {day: '2-digit'});
    // Generate yyyy-mm-dd date string
    return year + '-' + month + '-' + day;
  };

  const getAllBooking = (_date = new Date().toLocaleDateString('vi-VN')) => {
    console.log(
      pitchId,
      _date,
      dateBooking,
      `${host}/api/tenant/booking/all?pid=${pitchId}&date=${_date}`,
    );
    fetch(`${host}/api/tenant/booking/all?pid=${pitchId}&date=${_date}`, {
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
        console.log(resJson.bookings);
        if (resJson.bookings) {
          resJson.bookings.forEach(booking => {
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
            });
          });
        }
        console.log(_events);
        setEvents(_events);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {events && (
          <EventCalendar
            style={{padding: 20}}
            events={events}
            width={SIZES.width - 40}
            formatHeader="DD-MM-YYYY"
            initDate={
              dateBooking
                ? `${dateBooking.split('/')[2]}-${dateBooking.split('/')[1]}-${
                    dateBooking.split('/')[0]
                  }`
                : formatDate(date)
            }
            renderEvent={event => (
              <View
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
                      Ngày: {new Date(event.start).toLocaleDateString('vi-VN')}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            size={1}
            scrollToFirst
            start={4}
            end={24}
            format24h={true}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Calendar;
