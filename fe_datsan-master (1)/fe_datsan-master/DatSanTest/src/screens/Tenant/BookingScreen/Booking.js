import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AuthContext from '../../../context/AuthContext';
import CustomButton from '../../../components/common/CustomButton';
import moment from 'moment';
import {date} from 'yup';
import SelectDropdown from 'react-native-select-dropdown';
import DropDown from '../../../components/common/DropDown/DropDown';
import MultiSelect from 'react-native-multiple-select';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CheckBox} from 'react-native-elements';
import NotificationService from '../../../services/NotificationService.js';
const {width} = Dimensions.get('screen');
const Booking = ({navigation, route}) => {
  const [checked, setChecked] = useState(false);

  const {host, userToken} = useContext(AuthContext);
  const booking = route.params;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const [timeType, setTimeType] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [priceByHour, setPriceByHour] = useState(0);
  const [bookAdd, setBookAdd] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [currentDate, setCurrentDate] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [currentHour, setCurrentHour] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [timeStartTemp, setTimeStartTemp] = useState(null);
  const [isBookingExisted, setIsBookingExisted] = useState(false);
  const [listTeamAll, setTeamAll] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selected, setSelected] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState('');

  const dateNow = currentYear + '-' + currentMonth + '-' + currentDate;

  var timeNow = currentHour + ':' + currentMinute + ':' + '00';

  const scrollViewRef = useRef();
  const checkBookingExisted = (checkDate, start, end) => {
    fetch(
      `${host}/api/booking/time/existed?id=${booking.pitchDetailSc.id}&date=${checkDate}&start=${start}&end=${end}`,
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
        if (responseJson.message == 'existed') {
          setIsBookingExisted(true);
          alertMessage('Th??ng b??o', 'Gi??? n??y ???? ???????c ?????t', '????ng');
          setStartTime(null);
          setEndTime(null);
        } else if (responseJson.message == 'non-existed') {
          setIsBookingExisted(false);
          handlePress();
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handlePress = () => {
    fetch(
      `${host}/api/booking/price/${booking.pitchDetailSc.id}?${
        startTime ? 'start=' + startTime + '&' : ''
      }${endTime ? 'end=' + endTime + '&' : ''}${
        startDate ? 'date=' + startDate + '&' : ''
      }`,
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
        if (timeStart == null || timeEnd == null || startDate == '') {
          setPriceByHour(0);
        } else if (startDate == '') {
          setPriceByHour(0);
        } else {
          setPriceByHour(responseJson.message);
          if (isNaN(responseJson.message)) {
            setPriceByHour(0);
            alertMessage(
              'C???nh b??o',
              'L???i gi?? s??n!\nVui l??ng ch???n gi??? kh??c',
              '????ng',
            );
          }
        }
      })
      .catch(err => {
        console.error(err);
      });
  };
  const teamAll = () => {
    fetch(
      `${host}/api/tenant/team/all`,

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
        let team = responseJson.teams.map((item, index) => {
          return {id: item.id, name: item.name};
        });

        setTeamAll(team);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const onSelectedItemsChange = selectedItems => {
    setSelectedItems(selectedItems);

    for (let i = 0; i < selectedItems.length; i++) {
      var tempItem = listTeamAll.find(item => item.id == selectedItems[i]);
      console.log(tempItem);
    }
  };

  const BookAdd = () => {
    fetch(`${host}/api/booking/add/${booking.pitchDetailSc.id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        rentDate: dateStart,
        rentStart: timeStart,
        rentEnd: timeEnd,
        totalPrice: priceByHour,
        note: bookingNote,
        teams: selectedItems,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        let mTokens = responseJson.mTokens ? responseJson.mTokens : [];
        let tTokens = responseJson.tTokens ? responseJson.tTokens : [];
        console.log(tTokens);
        let notifications = responseJson.notifications;
        if (notifications) {
          notifications.forEach(notification => {
            if (notification.receiver == 'Team' && tTokens.length > 0) {
              tTokens.forEach(token => {
                NotificationService.sendNotification(
                  token,
                  notification.title,
                  notification.body,
                );
              });
            }
            if (notification.receiver == 'Manager' && mTokens.length > 0) {
              mTokens.forEach(token => {
                NotificationService.sendNotification(
                  token,
                  notification.title,
                  notification.body,
                );
              });
            }
          });
        }
        var bookdetailId = responseJson.message[1];
        if (responseJson.message[0] == 'success') {
          setBookingId(responseJson.message[1]);
          alertMessage('Th??ng b??o', '?????t s??n th??nh c??ng', '????ng');
          navigation.navigate('BookingDetail', {
            booking,
            timeStart,
            timeEnd,
            dateStart,
            priceByHour,
            bookingNote,
            bookdetailId,
          });
        } else {
          alertMessage('C???nh b??o', 'L???i ?????t s??n!', '????ng');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    var curDate = new Date().getDate(); //Current Date
    var curMonth = new Date().getMonth() + 1; //Current Month
    var curYear = new Date().getFullYear(); //Current Year
    var curHour = new Date().getHours();
    var curMinute = new Date().getMinutes();
    // if (curHour > 9) {
    //   setCurrentHour(curHour);
    // } else {
    //   setCurrentHour('0' + curHour);
    // }
    // if (curMinute > 9) {
    //   setCurrentMinute(curMinute+15);
    // } else {
    //   setCurrentMinute('0' + curMinute+15);
    // }
    if (curMinute + 15 >= 60) {
      if (curMinute + 15 - 60 > 9) {
        setCurrentMinute(curMinute + 15 - 60);
      } else {
        setCurrentMinute('0' + (curMinute + 15 - 60));
      }
      if (curHour + 1 >= 24) {
        if (curHour + 1 - 24 > 9) {
          setCurrentHour(curHour + 1 - 24);
        } else {
          setCurrentHour('0' + (curHour + 1 - 24));
        }
      } else {
        if (curHour + 1 > 9) {
          setCurrentHour(curHour + 1);
        } else {
          setCurrentHour('0' + (curHour + 1));
        }
      }
    } else {
      if (curHour > 9) {
        setCurrentHour(curHour);
      } else {
        setCurrentHour('0' + curHour);
      }
      if (curMinute + 15 > 9) {
        setCurrentMinute(curMinute + 15);
      } else {
        setCurrentMinute('0' + (curMinute + 15));
      }
    }

    setCurrentDate(curDate);
    setCurrentMonth(curMonth);
    setCurrentYear(curYear);
    teamAll();
  }, []);

  const showDatePicker = timeTypeInput => {
    setTimeType(timeTypeInput);
    if (!startDate) {
      alertMessage('Th??ng b??o', 'Vui l??ng nh???p ng??y tr?????c', '????ng');
    } else {
      setDatePickerVisibility(true);
    }
  };
  const showDatePicker1 = timeTypeInput => {
    setTimeType(timeTypeInput);
    if (!startDate) {
      alertMessage('Th??ng b??o', 'Vui l??ng nh???p ng??y tr?????c', '????ng');
    } else if (!startTime) {
      alertMessage('Th??ng b??o', 'Vui l??ng nh???p gi??? b???t ?????u tr?????c', '????ng');
    } else {
      setDatePickerVisibility(true);
    }
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const alertMessage = (title, message, cancelBtn) => {
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
  const handleConfirm = date => {
    var current = new Date();
    // var choose = date.toLocaleTimeString('vi-VN').split(':')[0].split('0')[1] + ':'+date.toLocaleTimeString('vi-VN').split(':')[1]+':'+'00'

    if (
      booking.open <=
        date.toLocaleTimeString('vi-VN').split(':')[0] +
          ':' +
          date.toLocaleTimeString('vi-VN').split(':')[1] +
          ':00' &&
      date.toLocaleTimeString('vi-VN').split(':')[0] +
        ':' +
        date.toLocaleTimeString('vi-VN').split(':')[1] +
        ':00' <=
        booking.close
    ) {
      if (timeType == 'startTime') {
        if (startDate.toString() == current.toLocaleDateString('vi-VN')) {
          if (date.toLocaleTimeString('vi-VN') >= timeNow) {
            if (!endTime || date.toLocaleTimeString('vi-VN') < endTime) {
              let tStart = date.toLocaleTimeString('vi-VN').split(':');
              setStartTime(`${tStart[0]}:${tStart[1]}:00`);
              setEndTime(null);
            } else if (endTime < date.toLocaleTimeString('vi-VN')) {
              alertMessage(
                'Ch???n sai kho???ng th???i gian',
                'Gi??? b???t ?????u kh??ng th??? l???n h??n gi??? k???t th??c!',
                '????ng',
              );
            }
          } else {
            alertMessage(
              'L???i ch???n gi??? ?????t s??n',
              'Gi??? hi???n t???i l??: ' +
                current.toLocaleTimeString('vi-VN') +
                '\nVui l??ng ?????t c??ch gi??? hi???n t???i t???i thi???u 15 ph??t',
              '????ng',
            );
          }
        } else {
          if (!endTime || date.toLocaleTimeString('vi-VN') < endTime) {
            let tStart = date.toLocaleTimeString('vi-VN').split(':');
            setStartTime(`${tStart[0]}:${tStart[1]}:00`);
          } else if (endTime < date.toLocaleTimeString('vi-VN')) {
            alertMessage(
              'Ch???n sai kho???ng th???i gian',
              'Gi??? b???t ?????u kh??ng th??? l???n h??n gi??? k???t th??c!',
              '????ng',
            );
          }
        }
      } else {
        if (startTime < date.toLocaleTimeString('vi-VN')) {
          let tEnd = date.toLocaleTimeString('vi-VN').split(':');
          let tDate = startDate.split('/');
          let d1 = tDate[2] + '-' + tDate[1] + '-' + tDate[0];
          let _tStart = new Date(d1 + ' ' + timeStart).getTime();
          let _tEnd = new Date(
            d1 + ' ' + date.toLocaleTimeString('vi-VN'),
          ).getTime();
          if (_tEnd - _tStart >= 2700000) {
            setEndTime(`${tEnd[0]}:${tEnd[1]}:00`);
            checkBookingExisted(
              startDate,
              startTime,
              `${tEnd[0]}:${tEnd[1]}:00`,
            );
          } else {
            alertMessage(
              'Th??ng b??o',
              'M???t tr???n ?????u t???i thi???u l?? 45 ph??t!\nVui l??ng ch???n l???i gi???',
              '????ng',
            );
          }
        } else {
          alertMessage(
            'Th??ng b??o',
            'Gi??? k???t th??c kh??ng th??? nh??? h??n gi??? b???t ?????u!',
            '????ng',
          );
        }
      }
    } else {
      alertMessage(
        'Th??ng b??o',
        'Gi??? ho???t ?????ng c???a s??n t???: ' +
          booking.open +
          ' ?????n: ' +
          booking.close +
          '',
        '????ng',
      );
    }

    hideDatePicker();
  };

  /////DATE
  const showDate = () => {
    setVisible(true);
  };

  const hideDate = () => {
    setVisible(false);
  };

  const handleDate = _date => {
    setStartDate(_date.toLocaleDateString('vi-VN'));
    setStartTime(null);
    setEndTime(null);

    hideDate();
  };
  var timeStart = startTime;
  var timeEnd = endTime;
  var dateStart = startDate;
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

  return (
    <View style={{backgroundColor: COLORS.white}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        {/* image */}
        <Image
          source={require('./fb-pitch1.jpg')}
          style={{
            height: 200,
            width: '100%',
            resizeMode: 'stretch',
            zIndex: -1,
          }}
        />
        {/* content */}
        <View
          style={{
            top: -50,
            width: '100%',
            backgroundColor: COLORS.white,
            zIndex: 99,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          {/* section name */}
          <View
            style={{
              flexDirection: 'row',
              padding: 20,
              justifyContent: 'space-between',
            }}
          >
            <View>
              <View style={[styles.facility]}>
                <FontAwesome name="soccer-ball-o" size={20} />
                <Text
                  style={[
                    styles.facilityText,
                    {
                      fontSize: SIZES.h4,
                      color: COLORS.blackColor,
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  T??n s??n: {booking.pitchDetailSc.name}
                </Text>
              </View>

              <View style={[styles.facility]}>
                <Icon name="store-mall-directory" size={21} />
                <Text
                  style={[
                    styles.facilityText,
                    {
                      fontSize: SIZES.h4,
                      color: COLORS.blackColor,
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  H??? th???ng s??n: {booking.pitchDetailSc.systemName}
                </Text>
              </View>
            </View>
          </View>
          {/* section agent */}
          <View style={{marginTop: -20, paddingLeft: 20}}>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('./fb-pitch1.jpg')}
                style={{height: 50, width: 50, borderRadius: 50 / 2}}
              />
              <View style={{flex: 1, paddingLeft: 7}}>
                <View style={[style.facility]}>
                  <Icon name="support-agent" size={21} />
                  <Text
                    style={[
                      styles.facilityText,
                      {
                        fontSize: SIZES.h7,
                        color: COLORS.blackColor,
                      },
                    ]}
                  >
                    {booking.pitchDetailSc.owner}
                  </Text>
                </View>

                <View style={[styles.facility]}>
                  <Icon name="phone" size={21} />
                  <Text
                    style={[
                      styles.facilityText,
                      {
                        fontSize: SIZES.h7,
                        color: COLORS.blackColor,
                      },
                    ]}
                  >
                    S??? ??i???n tho???i:
                  </Text>
                </View>
                <View style={[styles.facility]}>
                  <Icon name="error-outline" size={21} />
                  <Text
                    style={[
                      styles.facilityText,
                      {
                        fontSize: SIZES.h7,
                        color: COLORS.blackColor,
                      },
                    ]}
                  >
                    Th??ng tin: s??n {booking.pitchDetailSc.type},{' '}
                    {booking.pitchDetailSc.grass}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* description */}
          <View style={{paddingLeft: 20, flexDirection: 'column'}}>
            <View style={[style.facility]}>
              <Icon name="error" size={21} />
              <Text
                style={[
                  styles.facilityText,
                  {
                    fontSize: SIZES.h7,
                    color: COLORS.blackColor,
                    fontWeight: 'bold',
                  },
                ]}
              >
                {' '}
                Th??ng tin ?????t s??n:
              </Text>
            </View>

            <Text
              style={{
                fontFamily: FONTS.Regular,
                color: COLORS.grey,
                fontSize: 12,
              }}
            >
              <View
                style={[
                  baseStyles.row,
                  baseStyles.w75,
                  baseStyles.spaceBetween,
                  baseStyles.mt10,
                  baseStyles.centerVertically,
                  {},
                ]}
              >
                <Text style={[{fontSize: SIZES.h7, color: COLORS.blackColor}]}>
                  Ch???n ng??y:
                </Text>
                <DateTimePickerModal
                  isVisible={isVisible}
                  mode="date"
                  minimumDate={new Date(dateNow)}
                  onConfirm={handleDate}
                  onCancel={hideDate}
                />
                <TouchableOpacity
                  style={[baseStyles.w50, {}]}
                  onPress={() => showDate()}
                >
                  <TextInput
                    style={[
                      style.timeInput,
                      {marginLeft: 10, color: COLORS.blackColor},
                    ]}
                    placeholder="Nh???p ng??y ?????t s??n"
                    value={startDate}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
            </Text>
          </View>
          <View
            style={[
              {paddingLeft: 20, height: 40},
              baseStyles.row,
              baseStyles.w100,
              baseStyles.spaceBetween,
              baseStyles.mt10,
              baseStyles.centerVertically,
            ]}
          >
            <Text
              style={[
                {fontSize: SIZES.h7, color: COLORS.blackColor, marginTop: -15},
              ]}
            >
              Ch???n gi??? ????:
            </Text>
            <TouchableOpacity
              style={[
                baseStyles.w50,
                {marginTop: -14, marginRight: 20, left: 3, width: 80},
              ]}
              onPress={() => showDatePicker('startTime')}
            >
              <TextInput
                style={[{marginLeft: -1, color: COLORS.blackColor}]}
                placeholder="Gi??? b???t ?????u "
                value={startTime}
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
            <TouchableOpacity
              style={[baseStyles.w50, {marginTop: -14}]}
              onPress={() => {
                showDatePicker1('endTime');
              }}
            >
              <TextInput
                style={[{marginLeft: -5, color: COLORS.blackColor}]}
                placeholder="Gi??? k???t th??c "
                value={endTime}
                editable={false}
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="time"
              is24Hour={true}
              onConfirm={date => {
                handleConfirm(date), setChecked(false);
              }}
              onCancel={hideDatePicker}
            />
          </View>

          <View style={{width: SIZES.width - 40, marginHorizontal: 20}}>
            <MultiSelect
              items={listTeamAll}
              uniqueKey="id"
              onSelectedItemsChange={onSelectedItemsChange}
              selectedItems={selectedItems}
              selectText="Ch???n team"
              searchInputPlaceholderText="T??m ki???m ?????i..."
              onChangeInput={text => console.log(text)}
              tagRemoveIconColor={COLORS.primaryColor}
              tagTextColor="black"
              selectedItemTextColor="black"
              selectedItemIconColor="black"
              itemTextColor="black"
              displayKey="name"
              searchInputStyle={{color: 'black'}}
              submitButtonText="Ch???n ?????i"
              hideSubmitButton={false}
              selectedText={'?????i ???????c ch???n'}
              submitButtonColor={COLORS.primaryColor}
              tagBorderColor={COLORS.primaryColor}
              noItemsText="Kh??ng t??m th???y ?????i"
            />
          </View>
          <TextInput
            style={{
              marginTop: 10,
              height: 50,
              margin: 20,
              padding: 10,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            placeholder="Nh???p ghi ch?? s??n"
            multiline={true}
            borderBottomColor="gray"
            borderBottomWidth={1}
            borderLeftColor="gray"
            borderLeftWidth={1}
            borderRightColor="gray"
            borderRightWidth={1}
            editable={true}
            returnKeyType="done"
            onChangeText={text => {
              setBookingNote(text);
            }}
          />
          <View style={baseStyles.mh10}>
            <CheckBox
              style={style.checkbox}
              title={'X??c nh???n ??i???n ?????y ????? th??ng tin'}
              checked={checked}
              onPress={() => {
                setChecked(!checked);
                handlePress();
              }}
              size={15}
              color
            />
          </View>
        </View>
        <View style={[baseStyles.mh20, baseStyles.mb10, {marginTop: -40}]}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: FONTS.SemiBold,
              color: COLORS.grey,
            }}
          >
            Gi??
          </Text>
          <Text
            style={{
              fontSize: SIZES.h4,
              color: COLORS.blackColor,
              fontWeight: 'bold',
            }}
          >
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(priceByHour)}
          </Text>
        </View>

        <View
          style={[
            baseStyles.row,
            baseStyles.centerVertically,
            baseStyles.spaceBetween,
            baseStyles.mh20,
            baseStyles.mb20,
          ]}
        >
          {/* button */}
          <Pressable
            style={styles.btnContainer}
            onPress={() =>
              navigation.navigate('Calendar', {
                pitchId: booking.pitchDetailSc.id,
                dateBooking: startDate,
              })
            }
          >
            <Text style={styles.textContainer}>Xem l???ch</Text>
          </Pressable>

          <CustomButton
            text="Ti???p theo"
            type={
              isBookingExisted || priceByHour == 0 || isNaN(priceByHour)
                ? 'DISABLED'
                : 'PRIMARY'
            }
            onPress={() => {
              if (
                timeStart == null ||
                timeEnd == null ||
                dateStart == '' ||
                priceByHour == 0
              ) {
                Alert.alert('C???nh b??o', 'Vui l??ng nh???p ng??y gi??? ?????t s??n');
              } else if (priceByHour == NaN) {
                Alert.alert('C???nh b??o', 'L???i s??n');
              } else {
                BookAdd();
                setStartDate('');
                setStartTime(null);
                setEndTime(null);
                setPriceByHour(0);
                setSelectedItems([]);
                setChecked(false);
              }
            }}
            width="45%"
            disabled={
              isBookingExisted || priceByHour == 0 || isNaN(priceByHour)
            }
          />
        </View>

        {/* <Text>{selectedItems+' '}</Text> */}
      </ScrollView>
      {/* book */}
    </View>
  );
};
export default Booking;
const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white',
  },

  text: {
    padding: 12,
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
});
const style = StyleSheet.create({
  checkbox: {
    backgroundColor: 'white',
  },
  icon: {
    fontSize: 40,
    color: COLORS.primaryColor,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  pSTitle: {
    fontSize: 16,
    color: COLORS.blackColor,
  },
  pSImage: {
    width: 70,
    height: 50,
    borderRadius: 5,
  },
  itemRight: {
    position: 'absolute',
    right: 0,
  },
  itemIcon: {
    fontSize: 25,
    color: COLORS.editColor,
    marginLeft: '30%',
  },
  border: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrayColor,
  },

  facility: {flexDirection: 'row', marginRight: 10, marginTop: 5},
  facilityText: {marginLeft: 2, color: COLORS.grey},
  timeInput: {
    backgroundColor: COLORS.whiteColor,
    borderRadius: 5,
    borderColor: COLORS.borderColor,
  },
});
