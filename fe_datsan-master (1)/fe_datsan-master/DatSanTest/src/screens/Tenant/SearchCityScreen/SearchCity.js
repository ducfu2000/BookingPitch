import React, {useRef, useState, useEffect, useContext} from 'react';
import {ListItem, SearchBar, Avatar} from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';

import {
  SafeAreaView,
  View,
  StatusBar,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Touchable,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import baseStyles from '../../../constants/baseCss';
import {COLORS} from '../../../constants/theme';
import DropDown from '../../../components/common/DropDown/DropDown';
import SelectDropdown from 'react-native-select-dropdown';
import AuthContext from '../../../context/AuthContext';
import CustomButton from '../../../components/common/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SwipeUpDown from 'react-native-swipe-up-down';
import {images, icons, FONTS, SIZES} from '../../../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const {width} = Dimensions.get('screen');
import houses from '../../Yard';
import {Button} from 'react-native-elements';

const SearchCity = ({navigation}) => {
  const {host, userToken} = useContext(AuthContext);
  const categoryList = ['Sân đã đặt', 'Phổ Biến', 'Sân gần nhất'];
  const YardL = ['Sân tốt nhất'];
  const [pitchName, setPitchName] = useState('');
  const [data, setData] = useState([]);
  const [listPitch, setListPitch] = useState([]);
  const detailsName = 'PitchDetails';

  const [listProvinces, setListProvinces] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWards, setListWards] = useState([]);
  const listType = ['Loại sân', '5', '7', '11'];
  const [selectedProvince, setSelectedProvince] = useState('Thành phố Hà Nội');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [timeType, setTimeType] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isVisible, setVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString('vi-VN'),
  );

  const dateNow = currentYear + '-' + currentMonth + '-' + currentDate;

  const showDatePicker = timeTypeInput => {
    setTimeType(timeTypeInput);
    setDatePickerVisibility(true);
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
    if (timeType === 'startTime') {
      if (!endTime || date.toLocaleTimeString('vi-VN') < endTime) {
        let tStart = date.toLocaleTimeString('vi-VN').split(':');
        setStartTime(`${tStart[0]}:${tStart[1]}:00`);
      } else if (endTime < date.toLocaleTimeString('vi-VN')) {
        alertMessage(
          'Chọn sai khoảng thời gian',
          'Giờ bắt đầu không thể lớn hơn giờ kết thúc!',
          'Đóng',
        );
      }
    } else {
      if (startTime < date.toLocaleTimeString('vi-VN')) {
        let tEnd = date.toLocaleTimeString('vi-VN').split(':');

        setEndTime(`${tEnd[0]}:${tEnd[1]}:00`);
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
  const swipeUpDownRef = useRef();

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const handlePress = () => {
    fetch(
      `${host}/api/pitch/system/find?${
        selectedDistrict
          ? 'district=' + selectedDistrict.district_name + '&'
          : ''
      }${selectedWard ? 'ward=' + selectedWard.ward_name + '&' : ''}${
        startDate ? 'date=' + startDate + '&' : ''
      }${startTime ? 'start=' + startTime + '&' : ''}${
        endTime ? 'end=' + endTime + '&' : ''
      }${searchText ? 'system=' + searchText + '&' : ''}${
        selectedType ? 'type=' + selectedType + '&' : ''
      }
      ${selectedProvince ? 'city=' + selectedProvince.province_name : ''}
      `,
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
        setListPitch(responseJson.pitchSystems);
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    const unSubcribe = navigation.addListener('focus', () => {
      handlePress();
      var curDate = new Date().getDate(); //Current Date
      var curMonth = new Date().getMonth() + 1; //Current Month
      var curYear = new Date().getFullYear(); //Current Year
      setCurrentDate(curDate);
      setCurrentMonth(curMonth);
      setCurrentYear(curYear);
      swipeUpDownRef.current.showFull();
      handleGetListDistrictsPress();
      handleGetListWardsPress();
    });
    return unSubcribe;
  }, []);

  const hostCity = 'https://vapi.vnappmob.com';

  const handleGetListProvincePress = async () => {
    fetch(hostCity + '/api/province', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(responseJson => {
        setListProvinces(responseJson.results);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const handleGetListDistrictsPress = () => {
    fetch(hostCity + '/api/province/district/01', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(responseJson => {
        setListDistricts(responseJson.results);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleGetListWardsPress = async district_code => {
    fetch(hostCity + '/api/province/ward/' + district_code, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(responseJson => {
        setListWards(responseJson.results);

        // alert(responseJson[0].code);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <Pressable
        style={{marginVertical: 5}}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('detailsName', {
            iD: item.id,
            startTime,
            endTime,
            startDate,
          });
          console.log(startTime, endTime, startDate);
        }}
      >
        <View style={style.card}>
          <Image
            source={
              item.image
                ? {uri: item.image}
                : require('../../../assets/images/pitch.png')
            }
            style={style.cardImage}
          />
          <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {item.name}
              </Text>
            </View>

            <Text style={{color: COLORS.grey, fontSize: 14, marginTop: 5}}>
              {item.addressDetail}, {item.ward}, {item.district}, {item.city}
            </Text>

            <View style={{marginTop: 10, flexDirection: 'row'}}>
              <View style={style.facility}>
                <Icon name="restaurant" size={18} />
                <Text style={style.facilityText}>đồ ăn vặt</Text>
              </View>
              <View style={style.facility}>
                <Icon name="local-drink" size={18} />
                <Text style={style.facilityText}>trà đá</Text>
              </View>
              <View style={style.facility}>
                <Icon name="location-on" size={18} />
                <Text style={style.facilityText}>Hà Nội</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };
  const onSearchPressed = () => {
    handlePress();
  };
  const onResetPress = () => {
    setSearchText('');
    setSelectedDistrict('');
    onSearchPressed();
    setStartTime(null);
    setEndTime(null);
    setListDistricts(null);
    setListWards(null);
    setSelectedWard('');
    setSelectedDistrict('');
    setSelectedType('Loại sân');
    setSelectedType('');
    handleGetListDistrictsPress();
    handlePress();
  };
  const showDate = () => {
    setVisible(true);
  };

  const hideDate = () => {
    setVisible(false);
  };

  const handleDate = date => {
    setStartDate(date.toLocaleDateString('vi-VN'));

    hideDate();
  };
  return (
    <SafeAreaView
      style={{backgroundColor: COLORS.white, flex: 1, width: '100%'}}
    >
      <View
        style={{
          flexDirection: 'row',
          height: 70,
          width: '100%',
          backgroundColor: COLORS.white,
          paddingLeft: '1%',
          borderRadius: 10,
        }}
      >
        <View
          style={{
            width: '30%',
            height: 35,
            borderWidth: 2,
            marginRight: 5,
            borderRadius: 20,
            padding: 5,
            alignItems: 'center',
            top: 5,
            borderColor: 'lightgray',
          }}
        >
          <Text style={{fontSize: 14, alignContent: 'center'}}>Hà Nội</Text>
        </View>
        <View
          style={{
            width: '30%',
            height: 35,
            borderWidth: 2,
            marginRight: 5,
            borderRadius: 20,
            padding: 5,
            alignItems: 'center',
            top: 5,
            borderColor: 'lightgray',
          }}
        >
          <Text style={{fontSize: 14}}>{startDate}</Text>
        </View>

        {startTime && endTime ? (
          <View
            style={{
              width: '30%',
              height: 35,
              borderWidth: 2,
              marginRight: 5,
              borderRadius: 20,
              padding: 5,
              alignItems: 'center',
              top: 5,
              borderColor: 'lightgray',
            }}
          >
            <Text style={{fontSize: 14}}>
              {startTime.split(':')[0] +
                ':' +
                startTime.split(':')[1] +
                '-' +
                endTime.split(':')[0] +
                ':' +
                endTime.split(':')[1]}
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: '30%',
              height: 35,
              marginRight: 5,
              borderRadius: 20,
              padding: 5,
              alignItems: 'center',
              top: 5,
              borderColor: 'lightgray',
            }}
          >
            <Text style={{fontSize: 14}}></Text>
          </View>
        )}
        <View>
          <View
            style={{
              top: 0,
              width: 30,
              marginRight: 20,
              height: 30,
              right: 10,
              marginTop: 5,
            }}
          >
            <Icon
              onPress={() => {
                swipeUpDownRef.current.showFull();
                // onResetPress()
              }}
              name="filter-list-alt"
              size={30}
            />
          </View>
          <View>
            <Text style={{right: '100%', top: 10}}>
              Kết quả tìm kiếm ra: {listPitch.length ? listPitch.length : 0} sân
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        snapToInterval={width - 20}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingLeft: 20, paddingVertical: 20}}
        horizontal={false}
        data={listPitch}
        renderItem={renderItem}
      />

      <SwipeUpDown
        animation="spring"
        style={{opacity: 0.9}}
        ref={swipeUpDownRef}
        itemFull={close => (
          <SafeAreaView style={[baseStyles.root, {alignItems: 'center'}]}>
            <View style={[baseStyles.w100, {alignItems: 'flex-end'}]}>
              <TouchableOpacity style={{bottom: 10}} onPress={close}>
                <Icon name="cancel" size={20} />
              </TouchableOpacity>
            </View>

            <View style={baseStyles.w100}>
              <View style={{flexDirection: 'row', width: '100%'}}>
                <Text>Tên Sân</Text>
                <TouchableOpacity onPress={close}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.primaryColor,
                      borderRadius: 5,
                      height: 25,
                      width: '100%',
                      left: width - 180,
                    }}
                    onPress={() => {
                      Alert.alert(
                        'Đặt lại bộ lọc',
                        'Bạn có chắc đặt lại bộ lọc?',
                        [
                          {
                            text: 'Có',
                            onPress: () => {
                              onResetPress();
                              handleGetListDistrictsPress();
                              onSearchPressed();
                              // setSearchText(null)
                            },
                          },
                          {
                            text: 'Không',
                          },
                        ],
                      ),
                        onSearchPressed();
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.whiteColor,
                        padding: 2,
                        paddingLeft: 3,
                      }}
                    >
                      Đặt lại bộ lọc
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>

              <CustomInput
                placeholder="Tên Sân"
                style={{height: 40}}
                value={searchText}
                setValue={text => {
                  setSearchText(text);
                }}
              />
              <View
                style={[
                  baseStyles.row,
                  baseStyles.w100,
                  baseStyles.centerVertically,
                  baseStyles.spaceBetween,
                  {position: 'relative'},
                ]}
              >
                <View style={baseStyles.w25}>
                  <Text>Loại Sân</Text>
                  <DropDown
                    data={listType}
                    onSelect={(selectedItem, index) => {
                      if (selectedItem === 'Loại sân') {
                        setSelectedType('');
                      } else {
                        setSelectedType(selectedItem);
                      }
                    }}
                    defaultValue={'Loại'}
                    selectLabel={'Loại sân'}
                    buttonStyle={{
                      width: '150%',
                      backgroundColor: COLORS.whiteColor,
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: COLORS.lightGrayColor,
                      marginVertical: 1,
                      height: 40,
                    }}
                    defaultValueByIndex={
                      listType && listType.findIndex(e => e == selectedType)
                    }
                    // buttonTextStyle={{ fontSize: 16, color: COLORS.grayColor }}
                    // defaultValueByIndex={0}
                    // statusBarTranslucent={true}
                    // renderDropdownIcon={() => (
                    //   <Icon name="keyboard-arrow-down" size={24} />
                    // )}
                  />
                </View>
                <View style={[baseStyles.w80, {marginLeft: '18%'}]}>
                  <Text
                    style={[
                      baseStyles.ml10,
                      {fontSize: 14, color: COLORS.grayColor},
                    ]}
                  >
                    Chọn ngày:
                  </Text>
                  <DateTimePickerModal
                    isVisible={isVisible}
                    mode="date"
                    minimumDate={new Date(dateNow)}
                    onConfirm={handleDate}
                    onCancel={hideDate}
                  />
                  <TouchableOpacity
                    style={baseStyles.w75}
                    onPress={() => showDate()}
                  >
                    <TextInput
                      style={[style.timeInput, baseStyles.w90, {left: 10}]}
                      placeholder="Nhập ngày đặt sân"
                      value={startDate}
                      editable={false}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text>Địa chỉ</Text>
              <SelectDropdown
                data={listProvinces}
                defaultButtonText={'Thành phố Hà Nội'}
                buttonStyle={{
                  width: '100%',
                  backgroundColor: COLORS.whiteColor,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: COLORS.lightGrayColor,
                  marginVertical: 5,
                  height: 40,
                  color: COLORS.grayColor,
                }}
                buttonTextStyle={{fontSize: 16, color: COLORS.grayColor}}
                onSelect={(selectedItem, index) => {
                  // alert(selectedItem.province_name);
                  setSelectedProvince(selectedItem);
                  handleGetListDistrictsPress('01');
                }}
                disabled={true}
                label={'province_name'}
                width={'100%'}
              />

              <DropDown
                data={listDistricts}
                onSelect={(selectedItem, index) => {
                  setSelectedDistrict(selectedItem);
                  handleGetListWardsPress(selectedItem.district_id);
                }}
                buttonStyle={{
                  width: '100%',
                  backgroundColor: COLORS.whiteColor,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: COLORS.lightGrayColor,
                  marginVertical: 5,
                  height: 40,
                }}
                label={'district_name'}
                selectLabel={'Chọn quận/huyện'}
                width={'100%'}
                searchPlaceHolder="Tìm quận/huyện"
                search={true}
                renderSearchInputRightIcon={() => (
                  <Feather name="search" size={22} style={baseStyles.mr20} />
                )}
                defaultValueByIndex={
                  listDistricts &&
                  selectedDistrict.district_name &&
                  listDistricts.findIndex(
                    e => e.district_name == selectedDistrict.district_name,
                  )
                }
              />
              <DropDown
                data={listWards}
                onSelect={(selectedItem, index) => {
                  setSelectedWard(selectedItem);
                }}
                buttonStyle={{
                  width: '100%',
                  backgroundColor: COLORS.whiteColor,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: COLORS.lightGrayColor,
                  marginVertical: 5,
                  height: 40,
                }}
                label={'ward_name'}
                selectLabel={'Chọn phường/xã'}
                width={'100%'}
                search={true}
                renderSearchInputRightIcon={() => (
                  <Feather name="search" size={22} style={baseStyles.mr20} />
                )}
                defaultValueByIndex={
                  listWards &&
                  selectedWard.ward_name &&
                  listWards.findIndex(
                    e => e.ward_name == selectedWard.ward_name,
                  )
                }
              />
            </View>

            <View
              style={[
                baseStyles.row,
                baseStyles.w100,
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
                  style={[style.timeInput, {marginRight: 10}]}
                  placeholder="Nhập giờ bắt đầu"
                  value={startTime}
                  editable={false}
                />
              </TouchableOpacity>
              <Text style={{fontSize: 40}}>-</Text>
              <TouchableOpacity
                style={baseStyles.w45}
                onPress={() => showDatePicker('endTime')}
              >
                <TextInput
                  style={[style.timeInput, {marginLeft: 10}]}
                  placeholder="Nhập giờ nghỉ"
                  value={endTime}
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

            <CustomButton
              text="Tìm Kiếm"
              onPress={() => {
                onSearchPressed();
                close();
                console.log(selectedType);
              }}
              type={'PRIMARY'}
            />
          </SafeAreaView>
        )}
        disablePressToShow={false} // Press item mini to show full
      />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  btn: {
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: COLORS.whiteColor,
    backgroundColor: COLORS.primaryColor,
    borderRadius: 5,
  },
  address: {},
  timeInput: {
    padding: 6,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  actionSheetTitle: {
    fontSize: 20,
    color: COLORS.blackColor,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sortBtn: {
    backgroundColor: COLORS.dark,
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  optionsCard: {
    height: 210,
    width: width / 2 - 30,
    elevation: 15,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  optionsCardImage: {
    height: 140,
    borderRadius: 10,
    width: '100%',
  },
  optionListsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  categoryListText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: COLORS.grey,
  },
  activeCategoryListText: {
    color: COLORS.dark,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  categoryListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  card: {
    height: 250,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  facility: {flexDirection: 'row', marginRight: 19},
  facilityText: {marginLeft: 6, color: COLORS.grey},
  filter: {margin: 20, color: COLORS.grey},

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  center: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
  },
  cityStyle: {
    fontSize: 17,
    padding: 15,
  },
  panelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default SearchCity;
