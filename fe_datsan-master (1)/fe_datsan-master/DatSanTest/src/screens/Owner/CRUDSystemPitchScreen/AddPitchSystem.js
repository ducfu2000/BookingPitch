import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import AuthContext from '../../../context/AuthContext';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';

import {COLORS} from '../../../constants/theme';
import Geolocation from 'react-native-geolocation-service';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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

const AddSystemPitch = ({route, navigation}) => {
  const {userToken, host} = useContext(AuthContext);
  const {
    pitchSystemId,
    action,
    systemName,
    city,
    district,
    ward,
    addressDetail,
    description,
    hiredStart,
    hiredEnd,
  } = route.params;

  const [_systemName, setSystemName] = useState(systemName);
  const [_description, setDescription] = useState(description);
  const [_hiredStart, setHiredStart] = useState(hiredStart);
  const [_hiredEnd, setHiredEnd] = useState(hiredEnd);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timeType, setTimeType] = useState(null);

  const [errorMessage, setErrorMessage] = useState('');

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLocation();
      if (action == 'add') {
        navigation.setOptions({
          title: `Đăng ký hệ thống sân`,
        });
      } else if (action == 'update') {
        navigation.setOptions({
          title: `Sửa hệ thống`,
        });
      }
    });

    return unsubscribe;
  });

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            // alert(JSON.stringify(position));
            setLatitude(position['coords']['latitude']);
            setLongitude(position['coords']['longitude']);
          },
          error => {
            // See error code charts below.
            console.log('error: ' + error.code + ',' + error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };

  const showDatePicker = timeTypeInput => {
    setTimeType(timeTypeInput);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.log(timeType, date.toLocaleTimeString('vi-VN'));
    if (timeType == 'startTime') {
      console.log('alo');
      if (_hiredEnd == null || _hiredEnd > date.toLocaleTimeString('vi-VN')) {
        console.log('blo');
        let tStart = date.toLocaleTimeString('vi-VN').split(':');
        console.log(`${tStart[0]}:${tStart[1]}:00`);
        setHiredStart(`${tStart[0]}:${tStart[1]}:00`);
      } else if (_hiredEnd < date.toLocaleTimeString('vi-VN')) {
        alertMessage(
          'Chọn sai khoảng thời gian',
          'Giờ bắt đầu không thể lớn hơn giờ kết thúc!',
          'Đóng',
        );
      }
    } else {
      console.log(
        date.toLocaleTimeString('vi-VN').split(':')[0],
        date.toLocaleTimeString('vi-VN'),
      );
      if (
        _hiredStart < date.toLocaleTimeString('vi-VN') ||
        date.toLocaleTimeString('vi-VN').split(':')[0] == '00'
      ) {
        if (date.toLocaleTimeString('vi-VN').split(':')[0] == '00') {
          alertMessage(
            'Chọn sai khoảng thời gian',
            'Giờ bạn chọn đã sang ngày mới vui lòng chọn lại thời gian đóng cửa hệ thống',
            'Đóng',
          );
        } else {
          let tEnd = date.toLocaleTimeString('vi-VN').split(':');

          setHiredEnd(`${tEnd[0]}:${tEnd[1]}:00`);
        }
      } else {
        alertMessage(
          'Chọn sai khoảng thời gian',
          'Giờ kết thúc không thể nhỏ hơn giờ bắt đầu!',
          'Đóng',
        );
      }
    }
    hideDatePicker();
  };

  const addSystemPitchPress = () => {
    console.log(latitude, longitude);
    fetch(`${host}/api/owner/system/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        name: _systemName,
        city: city,
        district: district,
        ward: ward,
        addressDetail: addressDetail,
        description: _description,
        hiredStart: _hiredStart,
        hiredEnd: _hiredEnd,
        lat: latitude ? latitude : 21,
        lng: longitude ? longitude : 105,
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(JSON.stringify(resJson));
        console.log(resJson.message);
        if (resJson.message == 'success') {
          console.log(resJson.message);
          setSystemName(null);
          setHiredStart(null);
          setHiredEnd(null);
          setDescription(null);
          Alert.alert(
            'Đăng ký hệ thống sân',
            'Đăng ký hệ thống thành công. Vui lòng đợi Admin xác nhận.',
            [
              {
                text: 'Đóng',
                onPress: () => navigation.navigate('PitchSystemManagementSC'),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        } else {
          Alert.alert(
            'Đăng ký hệ thống sân',
            resJson.message,
            [
              {
                text: 'Quay lại',
                onPress: () =>
                  navigation.navigate('PitchManagement', {
                    pitchSystemId: pitchSystemId,
                  }),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const updateSystemPitchPress = () => {
    console.log(latitude, longitude, pitchSystemId);
    fetch(`${host}/api/owner/system/update/${pitchSystemId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        name: _systemName,
        city: city,
        district: district,
        ward: ward,
        addressDetail: addressDetail,
        description: _description,
        hiredStart: _hiredStart,
        hiredEnd: _hiredEnd,
        lat: latitude ? latitude : 21,
        lng: longitude ? longitude : 105,
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson.message);
        if (resJson.message == 'success') {
          setSystemName(null);
          setHiredStart(null);
          setHiredEnd(null);
          setDescription(null);

          Alert.alert(
            'Sửa thông tin hệ thống sân',
            'Sửa thông tin hệ thống sân thành công',
            [
              {
                text: 'Đóng',
                onPress: () =>
                  navigation.navigate('PitchManagementSC', {
                    pitchSystemId: pitchSystemId,
                  }),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        } else {
          Alert.alert(
            'Sửa thông tin hệ thống sân',
            resJson.message == '' || resJson.message == null
              ? resJson.message
              : 'Đã có lỗi xảy ra',
            [
              {
                text: 'Quay lại',
                onPress: () =>
                  navigation.navigate('PitchManagement', {
                    pitchSystemId: pitchSystemId,
                  }),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
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

  const onAddSystemPitchPress = () => {
    if (
      !_systemName ||
      !addressDetail ||
      !_hiredStart ||
      !_hiredEnd ||
      !city ||
      !district ||
      !ward
    ) {
      Alert.alert(
        'Điền đầy đủ thông tin',
        'Vui lòng điền thông tin những thông tin còn thiếu',
        [
          {
            text: 'Đóng',
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
        },
      );
    } else {
      if (action) {
        console.log(
          action,
          _systemName,
          city,
          district,
          ward,
          addressDetail,
          _hiredStart,
          _hiredEnd,
          _description,
        );
        action == 'add' ? addSystemPitchPress() : updateSystemPitchPress();
      }
    }
  };

  const onAddAddressPress = () => {
    navigation.navigate('AddAddress', {
      pitchSystemId: pitchSystemId,
      action: action,
      systemName: systemName,
      city: city,
      district: district,
      ward: ward,
      addressDetail: addressDetail,
      description: description,
      hiredStart: hiredStart,
      hiredEnd: hiredEnd,
    });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={[baseStyles.root]}>
        <View style={[{height: 600}, baseStyles.w100]}>
          <View style={baseStyles.w100}>
            <CustomInput
              label="Tên hệ thống sân"
              placeholder="Nhập tên hệ thống sân"
              value={_systemName}
              setValue={setSystemName}
              onBlur={() => setErrorMessage('Thông tin này là bắt buộc')}
              error={!_systemName && errorMessage}
            />

            <CustomInput
              label="Địa chỉ"
              placeholder="Tỉnh/Thành Phố, Quận/Huyện, Phường/Xã"
              value={
                city && district && ward && ward + ', ' + district + ', ' + city
              }
              // editable={false}
              onBlur={() => setErrorMessage('Thông tin này là bắt buộc')}
              onFocus={() => {
                onAddAddressPress();
              }}
              style={{color: COLORS.blackColor}}
              error={!city && !district && !ward && errorMessage}
              editable={action == 'update' ? false : true}
            />
            <Text
              style={[
                baseStyles.p15,
                baseStyles.border,
                baseStyles.rounded,
                {color: COLORS.blackColor},
              ]}
            >
              {addressDetail ? addressDetail : 'Tên đường, Tòa nhà, Số nhà'}
            </Text>

            <View style={baseStyles.w100}>
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
                  onPress={() => showDatePicker('startTime')}
                >
                  <CustomInput
                    label="Thời gian hoạt động"
                    placeholder="Nhập giờ mở cửa"
                    value={_hiredStart}
                    editable={false}
                    style={{color: COLORS.blackColor}}
                  />
                </TouchableOpacity>
                <Text style={{fontSize: 40}}>-</Text>
                <TouchableOpacity
                  style={baseStyles.w45}
                  onPress={() => showDatePicker('endTime')}
                >
                  <CustomInput
                    label=" "
                    placeholder="Nhập giờ đóng cửa"
                    value={_hiredEnd}
                    editable={false}
                    style={{color: COLORS.blackColor}}
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="time"
                  is24Hour={true}
                  onConfirm={date => handleConfirm(date)}
                  onCancel={hideDatePicker}
                />
              </View>
              {!_hiredStart ||
                (!_hiredEnd && (
                  <Text style={baseStyles.textError}>
                    Vui lòng nhập thời gian hoạt động
                  </Text>
                ))}
            </View>
            <CustomInput
              label={'Dịch vụ tại sân'}
              placeholder="Dịch vụ thêm"
              value={_description}
              setValue={setDescription}
            />

            <CustomButton
              text={'Xác nhận'}
              onPress={onAddSystemPitchPress}
              type={'PRIMARY'}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddSystemPitch;
