import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import CustomButton from '../../../components/common/CustomButton';
import moment from 'moment';
import {CheckBox} from 'react-native-elements';
import SwipeUpDown from 'react-native-swipe-up-down';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AuthContext from '../../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('screen');
const BookingDetail = ({navigation, route}) => {
  const {host, userToken} = useContext(AuthContext);

  const bookDetail = route.params;
  const [checked, setChecked] = useState(false);
  const swipeUpDownRef = useRef();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [timeType, setTimeType] = useState('');
  const [timeStart, setStartTime] = useState('');
  const [timeEnd, setEndTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [bookingDetails, setBookingDetails] = useState('');
  const [teams, setTeams] = useState([]);

  const BookingDetail = () => {
    fetch(`${host}/api/booking/detail/${bookDetail.bookdetailId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setBookingDetails(responseJson.booking);
        setTeams(responseJson.booking.teams);
        console.log(teams);
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    BookingDetail();
    console.log(bookDetail);
    console.log('bkdetail' + bookDetail.bookdetailId);
  }, []);

  const showDatePicker = timeTypeInput => {
    setTimeType(timeTypeInput);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    timeType == 'startTime'
      ? setStartTime(date.toLocaleTimeString('vi-VN'))
      : setEndTime(date.toLocaleTimeString('vi-VN'));
    hideDatePicker();
  };

  //DATE
  const showDate = () => {
    setVisible(true);
  };

  const hideDate = () => {
    setVisible(false);
  };

  const handleDate = date => {
    setStartDate(moment(date).format('DD/MM/yyyy'));
    console.log(startDate);
    hideDate();
  };

  return (
    <SafeAreaView style={{backgroundColor: COLORS.lightGray}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: COLORS.lightGray,
            height: '90%',
            margin: 10,
            borderRadius: 6,
          }}
        >
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Tên người đặt : {bookingDetails.tenant}
            </Text>
            {/* <Text style={{ color: COLORS.dangerColor, fontSize: 16 }}>
            Thông tin sân đặt
          </Text> */}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}
          >
            <Text style={{fontSize: 18, color: 'gray'}}>
              Tên sân: {bookingDetails.pitchName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}
          >
            <Text style={{fontSize: 18, color: 'gray'}}>
              Thuộc hệ thống sân: {bookingDetails.systemName}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              marginHorizontal: 10,
              marginTop: 10,
            }}
          >
            Đội đã chọn:{' '}
            {teams !== null ? (
              teams.map((team, index) => <Text>{team.name + ' '}</Text>)
            ) : (
              <Text>Không có đội</Text>
            )}
          </Text>

          <Text
            style={{
              borderRadius: 1,
              borderStyle: 'dashed',
              borderColor: '#DCDCDC',
              height: 1,
              borderWidth: 0.5,
              margin: 10,
            }}
          />
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Thông tin chi tiết
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}
          >
            <Text style={{fontSize: 18, color: 'gray'}}>
              Giờ : {bookingDetails.rentStart} - {bookingDetails.rentEnd}
            </Text>
            <Text style={{fontSize: 18, color: 'gray'}}>
              Cỡ sân : {bookDetail.booking.pitchDetailSc.type}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              marginHorizontal: 10,
              marginTop: 10,
            }}
          >
            Mã đặt sân : {bookingDetails.code}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              marginHorizontal: 10,
              marginTop: 10,
            }}
          >
            Trạng thái đơn :{' '}
            {bookingDetails.status == 'Awaiting payment'
              ? 'Chờ thanh toán'
              : ''}
          </Text>
          <Text
            style={{
              borderRadius: 1,
              borderStyle: 'dashed',
              borderColor: '#DCDCDC',
              height: 1,
              borderWidth: 0.5,
              margin: 10,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                color: 'gray',
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 10,
              }}
            >
              Ghi chú cho sân:
            </Text>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 18,
              }}
            >
              {bookingDetails.note ? bookingDetails.note : 'Không có gì cả'}
            </Text>
          </View>

          <Text
            style={{
              borderRadius: 1,
              borderStyle: 'dashed',
              borderColor: '#DCDCDC',
              height: 1,
              borderWidth: 0.5,
              margin: 10,
              marginTop: 20,
            }}
          />

          <View
            style={{
              height: 140,
              backgroundColor: '#8DA399',
              borderRadius: 6,
              marginTop: -10,
            }}
          >
            <View style={{padding: 10}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                Chi tiết tổng giá:
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 4,
                }}
              >
                <Text
                  style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
                >
                  Tổng
                </Text>
                <Text
                  style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}
                >
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(bookingDetails.totalPrice)}
                </Text>
              </View>

              <View
                style={[
                  baseStyles.w100,
                  baseStyles.row,
                  baseStyles.centerVertically,
                  baseStyles.spaceBetween,
                ]}
              >
                <CustomButton
                  text="Trang chủ"
                  type={'PRIMARY'}
                  onPress={() => navigation.popToTop()}
                  width="48%"
                />
                <CustomButton
                  text="Thanh toán"
                  type={'PRIMARY'}
                  onPress={() =>
                    navigation.navigate('Payment', {
                      bId: bookingDetails.id,
                      pId: bookDetail.booking.pitchDetailSc.id,
                    })
                  }
                  width="48%"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default BookingDetail;
// const style = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   contentBody: {
//     height: '100%',
//   },
//   footerBtn: {},
//   icon: {
//     fontSize: 40,
//     color: COLORS.primaryColor,
//   },
//   cardImage: {
//     width: '100%',
//     height: 120,
//     borderRadius: 15,
//   },
//   pSTitle: {
//     fontSize: 16,
//     color: COLORS.blackColor,
//   },
//   pSImage: {
//     width: 70,
//     height: 50,
//     borderRadius: 5,
//   },
//   itemRight: {
//     position: 'absolute',
//     right: 0,
//   },
//   itemIcon: {
//     fontSize: 25,
//     color: COLORS.editColor,
//     marginLeft: '30%',
//   },
//   borderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   border: {
//     width: '80%',
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGrayColor,
//   },
//   backgroundImageContainer: {
//     elevation: 20,
//     marginHorizontal: 20,
//     marginTop: 20,
//     alignItems: 'center',
//     height: 350,
//   },
//   backgroundImage: {
//     height: '100%',
//     width: '100%',
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   header: {
//     paddingVertical: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   headerBtn: {
//     height: 50,
//     width: 50,
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   ratingTag: {
//     height: 30,
//     width: 35,
//     backgroundColor: COLORS.blue,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   virtualTag: {
//     top: -20,
//     width: 120,
//     borderRadius: 10,
//     height: 40,
//     paddingHorizontal: 20,
//     backgroundColor: COLORS.dark,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   interiorImage: {
//     width: width / 3 - 20,
//     height: 80,
//     marginRight: 10,
//     borderRadius: 10,
//   },
//   footer: {
//     height: 70,
//     backgroundColor: COLORS.light,
//     borderRadius: 10,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 10,
//   },
//   bookNowBtn: {
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.gray,
//     borderRadius: 10,
//     paddingHorizontal: 20,
//   },
//   detailsContainer: {flex: 1, paddingHorizontal: 20, marginTop: 40},
//   facility: {flexDirection: 'row', marginRight: 15},
//   facilityText: {marginLeft: 5, color: COLORS.grey},
// });
