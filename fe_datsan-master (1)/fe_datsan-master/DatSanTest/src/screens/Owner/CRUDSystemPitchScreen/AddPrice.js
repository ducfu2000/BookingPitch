import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  Modal,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import AuthContext from '../../../context/AuthContext';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';

import {COLORS, SIZES} from '../../../constants/theme';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AddPrice = ({route, navigation}) => {
  const {userToken, host} = useContext(AuthContext);
  const {pitchSystemId, pitchId, action} = route.params;

  const [price, setPrice] = useState('');
  const [isWeekend, setIsWeekend] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timeType, setTimeType] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pitchSystem, setPitchSystem] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPitchSystemDetail();
    });
  });

  const getPitchSystemDetail = () => {
    fetch(`${host}/api/pitch/system/detail/${pitchSystemId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        setPitchSystem(resJson.pitchSystem);
        setTimeStart(resJson.pitchSystem.hiredStart);
        setTimeEnd(resJson.pitchSystem.hiredEnd);
      })
      .catch(error => {
        console.error(error);
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
    const hiredStart = pitchSystem.hiredStart;
    const hiredEnd = pitchSystem.hiredEnd;
    if (timeType == 'startTime') {
      if (timeEnd == '' || timeEnd > date.toLocaleTimeString('vi-VN')) {
        const hiredStartInput = date.toLocaleTimeString('vi-VN').split(':');
        if (hiredStart <= `${hiredStartInput[0]}:${hiredStartInput[1]}:00`) {
          setTimeStart(`${hiredStartInput[0]}:${hiredStartInput[1]}:00`);
        } else {
          alertMessage(
            'Khung th???i gian kh??ng h???p l???',
            'Gi??? b???t ?????u kh??ng th??? nh??? h??n gi??? b???t ?????u ho???t ?????ng c???a h??? th???ng!',
            '????ng',
          );
        }
      } else if (timeEnd < date.toLocaleTimeString('vi-VN')) {
        alertMessage(
          'Khung th???i gian kh??ng h???p l???',
          'Gi??? b???t ?????u kh??ng th??? l???n h??n gi??? k???t th??c!',
          '????ng',
        );
      }
    } else {
      if (
        timeStart < date.toLocaleTimeString('vi-VN') ||
        date.toLocaleTimeString('vi-VN').split(':')[0] == '00'
      ) {
        const hiredEndInput = date.toLocaleTimeString('vi-VN').split(':');
        if (
          hiredEnd >=
          `${hiredEndInput[0] == '00' ? '24' : hiredEndInput[0]}:${
            hiredEndInput[1]
          }:00`
        ) {
          setTimeEnd(`${hiredEndInput[0]}:${hiredEndInput[1]}:00`);
        } else {
          alertMessage(
            'Khung th???i gian kh??ng h???p l???',
            'Gi??? k???t th??c kh??ng th??? l???n h??n gi??? ng??ng ho???t ?????ng c???a h??? th???ng!',
            '????ng',
          );
        }
      } else {
        alertMessage(
          'Khung th???i gian kh??ng h???p l???',
          'Gi??? k???t th??c kh??ng th??? nh??? h??n gi??? b???t ?????u!',
          '????ng',
        );
      }
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

  const onAddPricePress = () => {
    if (timeStart == '' || timeEnd == '' || price == '') {
      alertMessage(
        'Th??ng tin c??n thi??u',
        'Vui l??ng ??i???n ?????y ????? th??ng tin',
        '????ng',
      );
    } else {
      navigation.navigate('AddPitch', {
        timeStart: timeStart,
        timeEnd: timeEnd,
        price: price,
        isWeekend: isWeekend,
        pitchSystemId: pitchSystemId,
        pitchId: pitchId,
        action: action,
      });
    }
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flex: 1}}
    >
      <SafeAreaView style={[baseStyles.root, {position: 'relative'}]}>
        <View style={[baseStyles.w100, baseStyles.mb10]}>
          <Text style={[baseStyles.left]}>Gi?? theo khung gi???</Text>
          {pitchSystem && (
            <Text style={[baseStyles.left]}>
              Gi??? ho???t ?????ng c???a h??? th???ng {pitchSystem.hiredStart} {' - '}{' '}
              {pitchSystem.hiredEnd}
            </Text>
          )}
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
              <TextInput
                style={[styles.timeInput, {marginRight: 10}]}
                placeholder="Gi??? b???t ?????u"
                value={timeStart}
                editable={false}
              />
            </TouchableOpacity>
            <Text style={{fontSize: 40}}>-</Text>
            <TouchableOpacity
              style={baseStyles.w45}
              onPress={() => showDatePicker('endTime')}
            >
              <TextInput
                style={[styles.timeInput, {marginLeft: 10}]}
                placeholder="Gi??? k???t th??c"
                value={timeEnd}
                editable={false}
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
        </View>
        <CustomInput
          label={'Gi?? ti???n ( xx.xxx/ 1 ti???ng )'}
          placeholder="Nh???p gi?? ti???n"
          value={price}
          setValue={setPrice}
          keyboardType="number-pad"
          onPressOut={() => setErrorMessage('B???t bu???c nh???p tr?????ng n??y')}
          error={price ? '' : errorMessage}
        />
        <View style={[baseStyles.left, baseStyles.row]}>
          <BouncyCheckbox
            size={22}
            style={{marginVertical: 6}}
            isChecked={isWeekend}
            iconStyle={{borderColor: COLORS.primaryColor}}
            fillColor={COLORS.primaryColor}
            onPress={() => setIsWeekend(!isWeekend)}
            bounceEffectIn={1.2}
          />
          <Text style={baseStyles.pt6}>Cu???i tu???n</Text>
        </View>
        <View style={styles.bottomBtn}>
          <Text style={{color: COLORS.dangerColor}}>
            L??u ?? ????? ph??ng nh???ng tr?????ng h???p t??nh sai s??? ti???n tr??nh th??m tr??ng
            ho???c thi???u khung gi???
          </Text>
          <CustomButton
            text="Th??m"
            onPress={onAddPricePress}
            type={'PRIMARY'}
            width={'100%'}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AddPrice;
