import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import baseStyles from '../../../constants/baseCss';
import {COLORS} from '../../../constants';
import Feather from 'react-native-vector-icons/Feather';
import AuthContext from '../../../context/AuthContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDown from '../../../components/common/DropDown/DropDown';
import styles from './styles';

const AddBooking = ({navigation}) => {
  const {host, userToken} = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [timeType, setTimeType] = useState(null);
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pitchSystems, setPitchSystems] = useState(null);
  const [pitchSystem, setPitchSystem] = useState(null);
  const [pitch, setPitch] = useState(null);
  const [note, setNote] = useState(null);
  const [price, setPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingExisted, setIsBookingExisted] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getListPitchSystem();
    });
    return unsubscribe;
  });

  const getListPitchSystem = () => {
    fetch(`${host}/api/manager/pitch/systems`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        setPitchSystems(resJson.pitchSystems);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getPitchSystemDetail = psId => {
    fetch(`${host}/api/manager/system/detail/${psId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        setPitchSystem(resJson.system);
        console.log(resJson.system);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getUserInfo = _phone => {
    console.log(_phone);
    fetch(`${host}/api/owner/manager/info?phone=${_phone}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.warning == undefined) {
          setUser(resJson.user);
        } else {
          Alert.alert('Lưu ý', resJson.warning + '', [
            {
              text: 'Đóng',
              style: 'cancel',
            },
          ]);
        }
        console.log(resJson.user);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onAddBookingPress = () => {
    if (pitch && price && date && timeStart && timeEnd) {
      fetch(`${host}/api/manager/booking/add/${pitch.id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
        body: JSON.stringify({
          phone: phoneNumber ? phoneNumber : null,
          rentDate: date.toLocaleDateString('vi-VN'),
          rentStart: timeStart,
          rentEnd: timeEnd,
          totalPrice: price,
          payment: null,
          note: note ? note : '',
        }),
      })
        .then(res => res.json())
        .then(resJson => {
          console.log(resJson.message);
          if (resJson.message == 'success') {
            Alert.alert('Đặt sân', 'Đặt sân thành công', [
              {
                text: 'Đóng',
                onPress: () =>
                  navigation.navigate('OBookingList', {
                    sid: pitchSystem.id,
                    status: 'Confirmed',
                  }),
                style: 'cancel',
              },
            ]);
          } else {
            Alert.alert('Đặt sân', resJson.message, [
              {
                text: 'Quay lại',
                onPress: () =>
                  navigation.navigate('OBookingList', {
                    sid: pitchSystem.id,
                    status: 'Confirmed',
                  }),
                style: 'cancel',
              },
            ]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const checkBookingExisted = (checkDate, start, end) => {
    fetch(
      `${host}/api/booking/time/existed?id=${pitch.id}&date=${checkDate}&start=${start}&end=${end}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.message);
        if (responseJson.message == 'existed') {
          setIsBookingExisted(true);
          alertMessage('Thông báo', 'Khung giờ này đã được đặt', 'Đóng');
          setTimeStart(null);
          setTimeEnd(null);
        } else if (responseJson.message == 'non-existed') {
          setIsBookingExisted(false);
          checkPriceOfBooking(date, start, end);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const checkPriceOfBooking = (checkDate, start, end) => {
    console.log(
      `${host}/api/booking/price/${
        pitch.id
      }?date=${checkDate.toLocaleDateString(
        'vi-VN',
      )}&start=${start}&end=${end}`,
    );
    fetch(
      `${host}/api/booking/price/${
        pitch.id
      }?date=${checkDate.toLocaleDateString(
        'vi-VN',
      )}&start=${start}&end=${end}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.message);
        setPrice(responseJson.message);
      })
      .catch(err => {
        console.error(err);
      });
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

  const handlePickDate = selectedDate => {
    console.log(selectedDate);
    setDate(selectedDate);
  };

  const hideDatePickerModal = () => {
    setDatePickerVisibility(false);
  };

  const showDatePicker = timeTypeInput => {
    setTimeType(timeTypeInput);
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = _date => {
    console.log(
      _date.toLocaleTimeString('vi-VN').split(':')[0] +
        ':' +
        _date.toLocaleTimeString('vi-VN').split(':')[1] +
        ':00',
    );
    var currentDate = new Date();

    if (
      pitchSystem.hiredStart <=
        _date.toLocaleTimeString('vi-VN').split(':')[0] +
          ':' +
          _date.toLocaleTimeString('vi-VN').split(':')[1] +
          ':00' &&
      _date.toLocaleTimeString('vi-VN').split(':')[0] +
        ':' +
        _date.toLocaleTimeString('vi-VN').split(':')[1] +
        ':00' <=
        pitchSystem.hiredEnd
    ) {
      if (timeType == 'startTime') {
        if (
          date.toLocaleDateString('vi-VN') ==
          currentDate.toLocaleDateString('vi-VN')
        ) {
          if (
            _date.toLocaleTimeString('vi-VN') >
            currentDate.toLocaleTimeString('vi-VN')
          ) {
            if (!timeEnd || _date.toLocaleTimeString('vi-VN') < timeEnd) {
              let tStart = _date.toLocaleTimeString('vi-VN').split(':');
              setTimeStart(`${tStart[0]}:${tStart[1]}:00`);
            } else if (timeEnd < _date.toLocaleTimeString('vi-VN')) {
              alertMessage(
                'Chọn sai khoảng thời gian',
                'Giờ bắt đầu không thể lớn hơn giờ kết thúc!',
                'Đóng',
              );
            }
          } else {
            alertMessage(
              'Lỗi chọn giờ đặt sân',
              'Giờ hiện tại là: ' +
                currentDate.toLocaleTimeString('vi-VN') +
                '\nVui lòng đặt cách giờ hiện tại tối thiểu 15 phút',
              'Đóng',
            );
          }
        } else {
          if (!timeEnd || _date.toLocaleTimeString('vi-VN') < timeEnd) {
            let tStart = _date.toLocaleTimeString('vi-VN').split(':');
            setTimeStart(`${tStart[0]}:${tStart[1]}:00`);
          } else if (timeEnd < _date.toLocaleTimeString('vi-VN')) {
            alertMessage(
              'Chọn sai khoảng thời gian',
              'Giờ bắt đầu không thể lớn hơn giờ kết thúc!',
              'Đóng',
            );
          }
        }
      } else {
        if (timeStart < _date.toLocaleTimeString('vi-VN')) {
          let tEnd = _date.toLocaleTimeString('vi-VN').split(':');
          let d1 = formatDate(date);
          let _tStart = new Date(d1 + ' ' + timeStart).getTime();
          let _tEnd = new Date(
            d1 + ' ' + _date.toLocaleTimeString('vi-VN'),
          ).getTime();
          console.log(_tStart + ' ' + _tEnd + ' ' + d1);
          if (_tEnd - _tStart >= 2700000) {
            setTimeEnd(`${tEnd[0]}:${tEnd[1]}:00`);
            checkBookingExisted(date, timeStart, `${tEnd[0]}:${tEnd[1]}:00`);
          } else {
            alertMessage(
              'Thông báo',
              'Một trận đấu tối thiểu là 45 phút!\nVui lòng chọn lại giờ',
              'Đóng',
            );
          }
        } else {
          alertMessage(
            'Thông báo',
            'Giờ kết thúc không thể nhỏ hơn giờ bắt đầu!',
            'Đóng',
          );
        }
      }
    } else {
      alertMessage(
        'Thông báo',
        'Giờ hoạt động của sân từ: ' +
          pitchSystem.hiredStart +
          ' đến: ' +
          pitchSystem.hiredEnd +
          '',
        'Đóng',
      );
    }

    hideDatePicker();
  };

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
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <SafeAreaView style={[baseStyles.root, {position: 'relative'}]}>
        <View style={baseStyles.left}>
          <Text>Hệ thống</Text>
          <DropDown
            search={true}
            data={pitchSystems && pitchSystems}
            onSelect={(selectedItem, index) => {
              getPitchSystemDetail(selectedItem.id);
            }}
            label={'name'}
            selectLabel={'Chọn hệ thống'}
            width={'100%'}
            searchPlaceHolder="Tìm kiếm"
            searchInputStyle={{
              borderBottomWidth: 1,
              borderBottomColor: COLORS.borderColor,
            }}
          />
        </View>
        {pitchSystem && (
          <View style={baseStyles.left}>
            <Text>Sân</Text>
            <DropDown
              search={true}
              data={pitchSystem.pitches}
              onSelect={(selectedItem, index) => {
                setPitch(selectedItem);
              }}
              label={'name'}
              selectLabel={'Chọn sân'}
              width={'100%'}
              searchPlaceHolder="Tìm kiếm"
              searchInputStyle={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.borderColor,
              }}
              renderCustomizedRowChild={item => (
                <View
                  style={[baseStyles.row, {backgroundColor: COLORS.whiteColor}]}
                >
                  <Text
                    style={[
                      baseStyles.p10,
                      baseStyles.textBold,
                      baseStyles.fontSize16,
                    ]}
                  >
                    {item.name + ' (' + item.type + 'v' + item.type + ')'}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
        <View style={[baseStyles.row, baseStyles.w100]}>
          <CustomInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại của người đặt"
            value={phoneNumber}
            setValue={setPhoneNumber}
            keyboardType="number-pad"
            onEndEditing={() => getUserInfo(phoneNumber)}
          />
          <Pressable onPress={() => setPhoneNumber('')}>
            <Feather name="x" size={24} style={styles.icon} />
          </Pressable>
        </View>
        <Pressable
          onPress={() => setDatePickerVisibility(true)}
          style={[baseStyles.left]}
        >
          <CustomInput
            label="Ngày đặt sân"
            placeholder="Nhập ngày đặt"
            value={date.toLocaleDateString('vi-VN')}
            width={'100%'}
            editable={false}
          />
        </Pressable>
        <View
          style={[
            baseStyles.w100,
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.mt10,
            baseStyles.centerVertically,
          ]}
        >
          <TouchableOpacity
            style={baseStyles.w45}
            onPress={() => {
              if (pitchSystem) {
                showDatePicker('startTime');
              } else {
                alertMessage(
                  'Thông báo',
                  'Vui lòng chọn hệ thống sân và sân muốn đặt',
                  'Đóng',
                );
              }
            }}
          >
            <TextInput
              style={[styles.timeInput, {marginRight: 10}]}
              placeholder="Giờ bắt đầu"
              value={timeStart}
              editable={false}
            />
          </TouchableOpacity>
          <Text style={{fontSize: 40}}>-</Text>
          <TouchableOpacity
            style={baseStyles.w45}
            onPress={() => {
              if (pitchSystem) {
                showDatePicker('endTime');
              } else {
                alertMessage(
                  'Thông báo',
                  'Vui lòng chọn hệ thống sân và sân muốn đặt',
                  'Đóng',
                );
              }
            }}
          >
            <TextInput
              style={[styles.timeInput, {marginLeft: 10}]}
              placeholder="Giờ kết thúc"
              value={timeEnd}
              editable={false}
            />
          </TouchableOpacity>
        </View>
        <View style={baseStyles.w100}>
          <CustomInput
            label="Thành tiền"
            placeholder="Nhập tổng tiền"
            value={price}
            setValue={setPrice}
            width="100%"
            multiline={true}
            underlineColorAndroid="transparent"
          />
          <CustomInput
            label="Ghi chú"
            placeholder="Nhập ghi chú"
            value={note}
            setValue={setNote}
            width="100%"
            multiline={true}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={[baseStyles.w100, baseStyles.mt20]}>
          <CustomButton
            text="Thêm"
            type="PRIMARY"
            onPress={onAddBookingPress}
          />
        </View>
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          minimumDate={new Date(formatDate(new Date()))}
          is24Hour={true}
          onConfirm={_date => handleConfirm(_date)}
          onCancel={hideDatePicker}
        />

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date(formatDate(new Date()))}
          onConfirm={handlePickDate}
          onCancel={hideDatePickerModal}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddBooking;
