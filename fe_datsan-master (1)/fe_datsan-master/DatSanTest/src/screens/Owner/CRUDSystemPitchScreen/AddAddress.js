import {StyleSheet, SafeAreaView, Alert, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import baseStyles from '../../../constants/baseCss';
import {COLORS} from '../../../constants/theme';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import DropDown from '../../../components/common/DropDown/DropDown';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
const AddAddress = ({route, navigation}) => {
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
  const [listProvinces, setListProvinces] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWards, setListWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('Thành phố Hà Nội');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [_addressDetail, setAddressDetail] = useState(addressDetail);
  const [errorMessage, setErrorMessage] = useState('');

  const onAddAddressPress = () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      Alert.alert(
        'Điền đầy đủ thông tin',
        'Vui lòng chọn thông tin những thông tin còn thiếu',
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
      navigation.navigate('AddSystemPitch', {
        pitchSystemId: pitchSystemId,
        action: action,
        systemName: systemName,
        city: selectedProvince,
        district: selectedDistrict.district_name,
        ward: selectedWard.ward_name,
        addressDetail: _addressDetail,
        description: description,
        hiredStart: hiredStart,
        hiredEnd: hiredEnd,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getListDistricts('01');
    });
    return unsubscribe;
  });

  const host = 'https://vapi.vnappmob.com';

  const handleGetListProvincePress = () => {
    fetch(host + '/api/province', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(responseJson => {
        setListProvinces(responseJson.results);
        // alert(listProvinces);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getListDistricts = (province_code = '01') => {
    fetch(host + '/api/province/district/' + province_code, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(responseJson => {
        setListDistricts(responseJson.results);
        if (district) {
          let _selectedDistrict = responseJson.results.find(
            e => e.district_name == district,
          );
          setSelectedDistrict(_selectedDistrict);
          console.log(_selectedDistrict);

          if (_selectedDistrict) {
            getListWards(_selectedDistrict.district_id);
          }
        }

        // alert(responseJson[0].code);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getListWards = district_code => {
    fetch(host + '/api/province/ward/' + district_code, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(responseJson => {
        setListWards(responseJson.results);
        if (ward) {
          let _selectedWard = responseJson.results.find(
            e => e.ward_name == ward,
          );
          console.log(_selectedWard, ward);
          setSelectedWard(_selectedWard);
        }

        // alert(responseJson[0].code);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      {/*  <DropDown
        data={listProvinces}
        onSelect={(selectedItem, index) => {
          // alert(selectedItem.province_name);
          setSelectedProvince(selectedItem);
          handleGetListDistrictsPress(selectedItem.province_id);
        }}
        label={'province_name'}
        selectLabel={'Chọn thành phố/tỉnh'}
        width={'100%'}
        selectValue={city}
      /> */}
      <View style={styles.center}>
        <Text style={styles.cityStyle}>{selectedProvince}</Text>
      </View>
      <DropDown
        data={listDistricts}
        onSelect={(selectedItem, index) => {
          setSelectedDistrict(selectedItem);
          getListWards(selectedItem.district_id);
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
          district &&
          listDistricts.findIndex(e => e.district_name == district)
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
          listWards && ward && listWards.findIndex(e => e.ward_name == ward)
        }
      />
      <CustomInput
        placeholder="Tên đường, Tòa nhà, Số nhà"
        value={_addressDetail}
        setValue={setAddressDetail}
        onBlur={() => setErrorMessage('Thông tin này là bắt buộc')}
        error={!_addressDetail && errorMessage}
      />
      <CustomButton
        text="Xác nhận"
        onPress={onAddAddressPress}
        type={'PRIMARY'}
      />
    </SafeAreaView>
  );
};

export default AddAddress;
