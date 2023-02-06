import {
  Text,
  View,
  Pressable,
  SafeAreaView,
  Image,
  Animated,
  PermissionsAndroid,
  Alert,
  StyleSheet,
} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';

import {COLORS} from '../../../constants/theme';
import AuthContext from '../../../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Shapes} from 'react-native-background-shapes';
import DropDown from '../../../components/common/DropDown/DropDown';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import Geolocation from 'react-native-geolocation-service';
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
const AccountInfo = ({navigation}) => {
  const {host, userToken, currentRole} = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [banks, setBanks] = useState(null);
  const [name, setName] = useState(null);
  const [bankingNumber, setBankingNumber] = useState(null);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listProvinces, setListProvinces] = useState(null);
  const [listDistricts, setListDistricts] = useState(null);
  const [listWards, setListWards] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [addressDetail, setAddressDetail] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserProfile();
      getUserBanks();
      getLocation();
    });
    if (user && !listProvinces) {
      getListProvince();
    }
    return unsubscribe;
  });

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            setLatitude(position['coords']['latitude']);
            setLongitude(position['coords']['longitude']);
            console.log(
              position['coords']['latitude'] +
                ',' +
                position['coords']['longitude'],
            );
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

  // get address
  const hostAddress = 'https://vapi.vnappmob.com';

  const getListProvince = () => {
    fetch(hostAddress + '/api/province', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(responseJson => {
        setListProvinces(responseJson.results);
        let _selectedProvince = responseJson.results.find(
          e => e.province_name == user.city,
        );
        setSelectedProvince(_selectedProvince);

        if (_selectedProvince) {
          getListDistricts(_selectedProvince.province_id);
        }
        // alert(listProvinces);
        setAddressDetail(user.addressDetail);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getListDistricts = province_code => {
    fetch(hostAddress + '/api/province/district/' + province_code, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(responseJson => {
        setListDistricts(responseJson.results);
        let _selectedDistrict = responseJson.results.find(
          e => e.district_name == user.district,
        );
        setSelectedDistrict(_selectedDistrict);
        if (_selectedDistrict) {
          getListWards(_selectedDistrict.district_id);
        }
        // alert(responseJson[0].code);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getListWards = district_code => {
    fetch(hostAddress + '/api/province/ward/' + district_code, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(responseJson => {
        setListWards(responseJson.results);
        let _selectedWard = responseJson.results.find(
          e => e.ward_name == user.ward,
        );
        setSelectedWard(_selectedWard);
        // alert(responseJson[0].code);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getUserProfile = () => {
    fetch(`${host}/api/common/user/profile`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.user) {
          setUser(resJson.user);
          setName(resJson.user.name);
        }
      })
      .catch(error => {
        console.error(error);
      });
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
        if (resJson.bankings.length > 0) {
          console.log(resJson.bankings);
          setBanks(resJson.bankings);
          const bNum = resJson.bankings[0].bankingNumber.split('');
          for (let i = 0; i < bNum.length; i++) {
            if (i >= 3 && i <= bNum.length - 4) {
              bNum[i] = '*';
            }
          }
          setBankingNumber(bNum.join(''));
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const updateUserProfile = () => {
    console.log(user, selectedProvince, selectedDistrict, selectedWard);
    if (user && selectedProvince && selectedDistrict && selectedWard) {
      fetch(`${host}/api/common/user/update`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
        body: JSON.stringify({
          name: user.name,
          city: selectedProvince.province_name,
          district: selectedDistrict.district_name,
          ward: selectedWard.ward_name,
          addressDetail: addressDetail,
          lat: latitude,
          lng: longitude,
        }),
      })
        .then(res => res.json())
        .then(resJson => {
          console.log(resJson.message);
          if (resJson.message == 'success') {
            Alert.alert('Cập nhật thông tin', 'Cập nhật thông tin thành công', [
              {
                text: 'Đóng',
                onPress: () => {
                  setIsModalVisible(false);
                  getUserProfile();
                },
                style: 'cancel',
              },
            ]);
          } else {
            Alert.alert('Cập nhật thông tin', resJson.message, [
              {
                text: 'Đóng',
                onPress: () => {
                  setIsModalVisible(false);
                  getUserProfile();
                },
                style: 'cancel',
              },
            ]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      Alert.alert('Sửa thông tin', 'Vui lòng điền đầy đủ thông tin', [
        {text: 'Đóng', style: 'cancel'},
      ]);
    }
  };

  return (
    <SafeAreaView style={[baseStyles.root, {position: 'relative'}]}>
      <Shapes
        primaryColor={'#42C2FF'}
        secondaryColor={'#85F4FF'}
        height={2}
        borderRadius={0}
        figures={[
          {name: 'triangle', position: 'center', size: 60},
          {name: 'cutDiamond', position: 'flex-start', axis: 'top', size: 80},
          {name: 'diamondNarrow', position: 'center', axis: 'right', size: 100},
        ]}
      />
      {isSettingOpen && (
        <>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.cover]}
          ></Animated.View>
          <Animated.View style={styles.settingContainer}>
            <Pressable
              style={[
                baseStyles.row,
                baseStyles.centerVertically,
                baseStyles.mb15,
              ]}
              onPress={() => {
                setIsModalVisible(true);
                setIsSettingOpen(false);
              }}
            >
              <Feather
                name="edit-3"
                size={20}
                style={{color: '#2FA4FF', width: 30}}
              />
              <Text style={[baseStyles.fontSize16]}>Sửa thông tin cá nhân</Text>
            </Pressable>
            {currentRole == 'owner' && (
              <Pressable
                onPress={() => {
                  setIsSettingOpen(false);
                  navigation.navigate('BankManagement');
                }}
                style={[
                  baseStyles.row,
                  baseStyles.centerVertically,
                  baseStyles.mb15,
                ]}
              >
                <FontAwesome
                  name="credit-card"
                  size={20}
                  style={{color: '#7FBCD2', width: 30}}
                />
                <Text style={[baseStyles.fontSize16]}>
                  Quản lý thông tin ngân hàng
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => {
                setIsSettingOpen(false);
                navigation.navigate('ChangePassword', {
                  status: 'ChangePassword',
                });
              }}
              style={[baseStyles.row, baseStyles.centerVertically]}
            >
              <FontAwesome5
                name="exchange-alt"
                size={20}
                style={{color: '#FD841F', width: 30}}
              />
              <Text style={[baseStyles.fontSize16]}>Đổi mật khẩu</Text>
            </Pressable>
          </Animated.View>
        </>
      )}

      <Pressable
        onPress={() => navigation.navigate('ProfileSC')}
        style={styles.iconLeft}
      >
        <Feather
          name="chevron-left"
          size={35}
          style={{color: COLORS.whiteColor}}
        />
      </Pressable>
      <Pressable
        style={styles.iconRight}
        onPress={() => setIsSettingOpen(!isSettingOpen)}
      >
        <Feather name="settings" size={25} style={{color: COLORS.whiteColor}} />
      </Pressable>
      <Image
        style={styles.avatar}
        source={require('../../../assets/images/circled-user-male-skin-type-1-2.jpg')}
      />
      <Text style={styles.userName}>{user && user.name}</Text>
      <View style={styles.accountInfoContainer}>
        <View>
          <View
            style={[
              baseStyles.w100,
              baseStyles.row,
              baseStyles.centerVertically,
            ]}
          >
            <Text style={[baseStyles.textBold, baseStyles.fontSize16]}>
              Thông tin cá nhân
            </Text>
          </View>
          <View
            style={[
              baseStyles.row,
              baseStyles.centerVertically,
              baseStyles.spaceBetween,
              baseStyles.ph10,
              baseStyles.pv5,
            ]}
          >
            <Text>Số điện thoại</Text>
            <Text>{user && user.phone}</Text>
          </View>
          {currentRole == 'owner' && (
            <>
              <Pressable
                onPress={() => navigation.navigate('BankManagement')}
                style={[
                  baseStyles.w100,
                  baseStyles.row,
                  baseStyles.centerVertically,
                  baseStyles.mt10,
                ]}
              >
                <Text style={[baseStyles.textBold, baseStyles.fontSize16]}>
                  Thông tin ngân hàng
                </Text>
                <Feather
                  name="chevron-right"
                  size={22}
                  style={{marginTop: 3}}
                />
              </Pressable>
              {banks && banks.length !== 0 ? (
                <>
                  <View
                    style={[
                      baseStyles.row,
                      baseStyles.centerVertically,
                      baseStyles.spaceBetween,
                      baseStyles.ph10,
                      baseStyles.pv5,
                    ]}
                  >
                    <Text>Tên ngân hàng</Text>
                    <Text>{banks[0].shortName}</Text>
                  </View>
                  <View
                    style={[
                      baseStyles.row,
                      baseStyles.centerVertically,
                      baseStyles.spaceBetween,
                      baseStyles.ph10,
                      baseStyles.pv5,
                    ]}
                  >
                    <Text>Số tài khoản</Text>
                    <Text>{bankingNumber && bankingNumber}</Text>
                  </View>
                </>
              ) : (
                <Text>
                  Hiện chưa có tài khoản ngân hàng.{' '}
                  <Text
                    style={{
                      color: COLORS.infoColor,
                      textDecorationLine: 'underline',
                    }}
                    onPress={() => navigation.navigate('BankManagement')}
                  >
                    Thêm ngay
                  </Text>
                </Text>
              )}
            </>
          )}
          <Pressable
            style={[
              baseStyles.w100,
              baseStyles.row,
              baseStyles.centerVertically,
              baseStyles.mt10,
            ]}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={[baseStyles.textBold, baseStyles.fontSize16]}>
              Địa chỉ{' '}
            </Text>

            <Feather name="chevron-right" size={22} />
          </Pressable>
          <View
            style={[
              baseStyles.row,
              baseStyles.centerVertically,
              baseStyles.spaceBetween,
              baseStyles.ph10,
              baseStyles.pv5,
            ]}
          >
            {user &&
            !user.addressDetail &&
            !user.ward &&
            !user.district &&
            !user.city ? (
              <View>
                <Text>Hiện tại chưa có địa chỉ vui lòng cập nhật địa chỉ </Text>
                <Pressable onPress={() => setIsModalVisible(true)}>
                  <Text
                    style={{
                      color: COLORS.infoColor,
                      textDecorationLine: 'underline',
                    }}
                  >
                    tại đây!
                  </Text>
                </Pressable>
              </View>
            ) : (
              user && (
                <View>
                  <Text>
                    {user.addressDetail && user.addressDetail}
                    {user.ward && user.addressDetail
                      ? ', ' + user.ward
                      : user.ward}
                    {user.district && user.ward
                      ? ', ' + user.district
                      : user.district}
                    {user.city && user.district ? ', ' + user.city : user.city}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
      </View>
      {isModalVisible && (
        <>
          <Animated.View style={[styles.addressModal]}>
            <CustomInput placeholder="Tên" value={name} setValue={setName} />
            <DropDown
              data={listProvinces}
              onSelect={(selectedItem, index) => {
                // alert(selectedItem.province_name);
                setSelectedProvince(selectedItem);
                getListDistricts(selectedItem.province_id);
              }}
              label={'province_name'}
              selectLabel={'Chọn thành phố/tỉnh'}
              width={'100%'}
              search={true}
              renderSearchInputRightIcon={() => (
                <Feather name="search" size={22} style={baseStyles.mr20} />
              )}
              defaultValueByIndex={
                listProvinces &&
                listProvinces.findIndex(e => e.province_name == user.city)
              }
            />
            <DropDown
              data={listDistricts}
              onSelect={(selectedItem, index) => {
                setSelectedDistrict(selectedItem);
                getListWards(selectedItem.district_id);
              }}
              label={'district_name'}
              selectLabel={'Chọn quận/huyện'}
              width={'100%'}
              search={true}
              renderSearchInputRightIcon={() => (
                <Feather name="search" size={22} style={baseStyles.mr20} />
              )}
              defaultValueByIndex={
                listDistricts &&
                listDistricts.findIndex(e => e.district_name == user.district)
              }
            />
            <DropDown
              data={listWards}
              onSelect={(selectedItem, index) => {
                setSelectedWard(selectedItem);
              }}
              label={'ward_name'}
              selectLabel={'Chọn phường/xã'}
              width={'100%'}
              search={true}
              renderSearchInputRightIcon={() => (
                <Feather name="search" size={22} style={baseStyles.mr20} />
              )}
              defaultValueByIndex={
                listWards && listWards.findIndex(e => e.ward_name == user.ward)
              }
            />
            <CustomInput
              placeholder="Tên đường, Tòa nhà, Số nhà"
              value={addressDetail}
              setValue={setAddressDetail}
            />
            <View
              style={[baseStyles.w100, baseStyles.row, baseStyles.spaceBetween]}
            >
              <CustomButton
                text="Đóng"
                onPress={() => setIsModalVisible(false)}
                type={'DISABLED'}
                width={'48%'}
              />
              <CustomButton
                text="Xác nhận"
                onPress={updateUserProfile}
                type={'PRIMARY'}
                width={'48%'}
              />
            </View>
          </Animated.View>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.cover]}
          ></Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default AccountInfo;
