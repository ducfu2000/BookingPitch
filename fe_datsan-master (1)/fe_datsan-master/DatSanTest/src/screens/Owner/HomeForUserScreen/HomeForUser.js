import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import {COLORS} from '../../../constants';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Border from '../../../components/Border';
import AuthContext from '../../../context/AuthContext';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Yêu cầu truy cập vị trí',
        message: 'Chúng tôi có thể xin cấp quyền vị trí?',
        buttonNeutral: 'Nhắc lại sau',
        buttonNegative: 'Đóng',
        buttonPositive: 'Đồng ý',
      },
    );
    console.log('granted', granted);
    if (granted == 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const HomeForUser = ({navigation}) => {
  const {host, userToken} = useContext(AuthContext);
  const [bookings, setBookings] = useState(null);
  const [bookingListConfirmed, setBookingListConfirmed] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [isHaveBank, setIsHaveBank] = useState(false);
  const [isHaveSystem, setIsHaveSystem] = useState(false);
  const [date, setDate] = useState(
    new Date(currentYear, currentMonth - 1, currentDate),
  );
  const [isLoading, setIsLoading] = useState(false);

  const [currentDate, setCurrentDate] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const dateNow = currentYear + '-' + currentMonth + '-' + currentDate;
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      requestLocationPermission();
      getUserBanks();
      getPitchSystems();
      getAllBooking(new Date(), 'Pending');
      getAllBookingConfirmed(new Date());
    });
    var _date = new Date();
    var curDate = _date.getDate(); //Current Date
    var curMonth = _date.getMonth() + 1; //Current Month
    var curYear = _date.getFullYear(); //Current Year
    setCurrentDate(curDate);
    setCurrentMonth(curMonth);
    setCurrentYear(curYear);
    setDate(_date);
    return unsubscribe;
  }, []);

  const alertMessage = (title, message, cancelBtn, acceptBtn?) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelBtn,
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const getUserBanks = () => {
    fetch(`${host}/api/owner/banking/all`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.bankings && resJson.bankings.length > 0) {
          setIsHaveBank(true);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getPitchSystems = () => {
    fetch(`${host}/api/owner/pitch/systems`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.pitchSystems && resJson.pitchSystems.length > 0) {
          setIsHaveSystem(true);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getAllBooking = (_currentDate, status) => {
    setIsLoading(true);
    fetch(
      `${host}/api/manager/booking/all?date=${_currentDate.toLocaleDateString(
        'vi-VN',
      )}&status=${status}&page=1`,
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
          setBookings(resJson.booking);
        }
        if (resJson.booking.length == 0) {
          getAllBooking(_currentDate, 'Awaiting payment');
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getAllBookingConfirmed = _currentDate => {
    fetch(
      `${host}/api/manager/booking/all?date=${_currentDate.toLocaleDateString(
        'vi-VN',
      )}&status=Confirmed`,
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
          setBookingListConfirmed(resJson.booking);
          const _bookings = resJson.booking;
          var total = 0;
          _bookings.forEach(e => {
            total += e.price;
          });
          setTotalPrice(total);
          console.log(total);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onViewAllBookingsPress = () => {
    navigation.navigate('OBookingList', {
      sid: null,
      status: 'Pending',
    });
  };

  const onViewBookingDetailsPress = booking => {
    navigation.navigate('OBookingDetail', {
      bookingId: booking.id,
      backScreen: 'HomeForUser',
      status: 'Pending',
    });
  };

  const Item = ({myItem}) => {
    return (
      <View style={styles.revenueItem}>
        <View
          style={[
            baseStyles.row,
            baseStyles.centerVertically,
            baseStyles.spaceBetween,
            baseStyles.p10,
          ]}
        >
          <View style={baseStyles.mr40}>
            <Text>Sân {myItem.pitch}</Text>
            <Text>Thời gian {myItem.time}</Text>
          </View>
          <Text>
            {myItem.price.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
        </View>
      </View>
    );
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
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        style={baseStyles.w100}
      >
        {isHaveSystem && (
          <>
            <View
              style={[
                baseStyles.row,
                baseStyles.w100,
                baseStyles.mb10,
                baseStyles.spaceBetween,
              ]}
            >
              <Text style={[baseStyles.textBold, baseStyles.fontSize20]}>
                Tổng thu hôm nay
              </Text>
              <Text style={[baseStyles.mt5, baseStyles.fontSize15]}>
                {currentDate}/{currentMonth}/{currentYear}
              </Text>
            </View>
            <View style={styles.turnoverContainer}>
              <View style={[baseStyles.row, baseStyles.spaceBetween]}>
                <View style={[baseStyles.row]}>
                  <Text>
                    Các sân đã duyệt hôm nay:{' '}
                    <Text style={baseStyles.textBold}>
                      {bookingListConfirmed && bookingListConfirmed.length}
                    </Text>
                  </Text>
                </View>
                <View style={[baseStyles.row]}>
                  <Text>
                    Tổng thu:{' '}
                    <Text style={baseStyles.textBold}>
                      {totalPrice &&
                        totalPrice.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                    </Text>
                  </Text>
                </View>
              </View>
              <Border />
              {bookingListConfirmed && (
                <FlatList
                  keyboardShouldPersistTaps="always"
                  horizontal={true}
                  data={bookingListConfirmed}
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => <Item myItem={item} />}
                  keyExtractor={item => item.id}
                />
              )}
            </View>

            {/* Booking */}

            <View style={styles.bookingContainer}>
              <View
                style={[
                  baseStyles.row,
                  baseStyles.spaceBetween,
                  baseStyles.centerVertically,
                ]}
              >
                <Text style={[baseStyles.fontSize16, baseStyles.textBold]}>
                  Danh sách đặt sân hôm nay
                </Text>
                <Pressable
                  onPress={() => onViewAllBookingsPress()}
                  style={[baseStyles.row, baseStyles.centerVertically]}
                >
                  <Text style={styles.viewAllBookingsTextStyle}>
                    Xem tất cả
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    style={styles.viewAllBookingsIconStyle}
                  />
                </Pressable>
              </View>
              <Border />
              {isLoading ? (
                <ActivityIndicator size="large" />
              ) : bookings && bookings.length == 0 ? (
                <Text>Hiện tại chưa có sân nào được đặt.</Text>
              ) : (
                <FlatList
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                  data={bookings}
                  renderItem={({item}) => <BookingItem bItem={item} />}
                  keyExtractor={item => item.id}
                />
              )}
            </View>
          </>
        )}

        {(!isHaveBank || !isHaveSystem) && (
          <View style={baseStyles.w100}>
            <Text style={[baseStyles.fontSize18, baseStyles.textBold]}>
              Hoàn tất thông tin người dùng
            </Text>
            {!isHaveBank && (
              <>
                <Text style={styles.hindText}>
                  Hiện chưa có tài khoản ngân hàng.{' '}
                  <Pressable
                    onPress={() => navigation.navigate('BankManagement')}
                  >
                    <Text
                      style={{
                        color: COLORS.infoColor,
                        textDecorationLine: 'underline',
                      }}
                    >
                      Thêm ngay
                    </Text>
                  </Pressable>
                </Text>
              </>
            )}
            {!isHaveSystem && (
              <>
                <Text style={styles.hindText}>
                  Hiện chưa có hệ thống sân nào.{' '}
                  <Text
                    style={{
                      color: COLORS.infoColor,
                      textDecorationLine: 'underline',
                    }}
                    onPress={() => navigation.navigate('PitchSystems')}
                  >
                    Thêm ngay
                  </Text>
                </Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeForUser;
