import {Text, View, Pressable, SafeAreaView, Image, Alert} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import baseStyles from '../../../constants/baseCss';
import {COLORS} from '../../../constants/theme';
import AuthContext from '../../../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';
import Border from '../../../components/Border';
import DropDown from '../../../components/common/DropDown/DropDown';
import styles from './styles';
const AddBankInfo = ({route, navigation}) => {
  const {action, id, name, bin, bankingNumber} = route.params;
  const {host, userToken} = useContext(AuthContext);
  const [banks, setBanks] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankNumber, setBankNumber] = useState(bankingNumber);
  const [_name, setName] = useState(name);

  useEffect(() => {
    const getBanks = navigation.addListener('focus', () => {
      bankLists();
    });
    return getBanks;
  });

  const bankLists = () => {
    fetch('https://api.vietqr.io/v2/banks', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(resJson => {
        setBanks(resJson.data);
        setSelectedBank(resJson.data.filter(bank => bank.bin == bin)[0]);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onActionBankInfoPress = () => {
    console.log(selectedBank, _name, bankNumber, action);
    if (selectedBank && _name && bankNumber) {
      action == 'add'
        ? addBankInfoPress()
        : action == 'update' && updateBankInfoPress();
    } else {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin', [
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ]);
    }
  };

  const addBankInfoPress = () => {
    fetch(`${host}/api/owner/banking/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        name: _name,
        code: selectedBank.code,
        bin: selectedBank.bin,
        shortName: selectedBank.shortName,
        logo: selectedBank.logo,
        bankingNumber: bankNumber,
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson.message);
        if (resJson.message == 'success') {
          Alert.alert('Thêm tài khoản', 'Thêm tài khoản thành công', [
            {
              text: 'Đóng',
              onPress: () => {
                navigation.navigate('BankList');
              },
              style: 'cancel',
            },
          ]);
        } else {
          Alert.alert('Thêm tài khoản', resJson.message, [
            {
              text: 'Quay lại',
              onPress: () => {
                navigation.navigate('BankList');
              },
              style: 'cancel',
            },
          ]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const updateBankInfoPress = () => {
    fetch(`${host}/api/owner/banking/update/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        name: _name,
        code: selectedBank.code,
        bin: selectedBank.bin,
        shortName: selectedBank.shortName,
        logo: selectedBank.logo,
        bankingNumber: bankNumber,
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.message == 'success') {
          Alert.alert(
            'Sửa thông tin tài khoản',
            'Sửa thông tin tài khoản thành công',
            [
              {
                text: 'Đóng',
                onPress: () => {
                  navigation.navigate('BankList');
                },
                style: 'cancel',
              },
            ],
          );
        } else {
          Alert.alert('Sửa thông tin tài khoản', resJson.message, [
            {
              text: 'Quay lại',
              onPress: () => {
                navigation.navigate('BankList');
              },
              style: 'cancel',
            },
          ]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      <View style={baseStyles.left}>
        {selectedBank && selectedBank ? (
          <View
            style={[
              baseStyles.w100,
              baseStyles.row,
              baseStyles.centerVertically,
              baseStyles.spaceBetween,
            ]}
          >
            <Text>Điền đầy đủ thông tin</Text>
            <Text
              onPress={() => setSelectedBank(null)}
              style={{color: COLORS.infoColor, textDecorationLine: 'underline'}}
            >
              Chọn ngân hàng <Feather name="chevron-right" size={16} />
            </Text>
          </View>
        ) : (
          <Text style={baseStyles.mb10}>Chọn ngân hàng</Text>
        )}
        {selectedBank && selectedBank ? (
          <View style={baseStyles.w100}>
            <View
              style={[
                baseStyles.row,
                baseStyles.centerVertically,
                baseStyles.mv5,
              ]}
            >
              <Image
                source={{uri: selectedBank.logo}}
                style={{width: 70, height: 30, marginRight: 4}}
              />
              <View>
                <Text style={{color: COLORS.blackColor}}>
                  {selectedBank.short_name}
                </Text>
                <Text style={baseStyles.fontSize12}>{selectedBank.name}</Text>
              </View>
            </View>
            <Border />
            <CustomInput
              placeholder={'Nhập số tài khoản'}
              value={bankNumber}
              setValue={setBankNumber}
            />
            <CustomInput
              placeholder={'Nhập tên chủ tài khoản'}
              value={name}
              setValue={setName}
              autoCapitalize="characters"
            />
            <CustomButton
              text={'Lưu'}
              onPress={() => onActionBankInfoPress()}
              type="PRIMARY"
            />
          </View>
        ) : (
          <DropDown
            search={true}
            data={banks}
            onSelect={(selectedItem, index) => {}}
            label={'short_name'}
            selectLabel={'Chọn ngân hàng'}
            width={'100%'}
            searchPlaceHolder="Tìm kiếm"
            statusBarTranslucent={true}
            searchInputStyle={{
              borderBottomWidth: 1,
              borderBottomColor: COLORS.borderColor,
            }}
            renderCustomizedRowChild={item => (
              <Pressable
                onPress={() => setSelectedBank(item)}
                style={styles.bankItem}
              >
                <View
                  style={[
                    baseStyles.row,
                    baseStyles.centerVertically,
                    baseStyles.mv5,
                  ]}
                >
                  <Image
                    source={{uri: item.logo}}
                    style={{width: 70, height: 30, marginRight: 4}}
                  />
                  <View>
                    <Text style={{color: COLORS.blackColor}}>
                      {item.short_name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[baseStyles.fontSize12, baseStyles.w75]}
                    >
                      {item.name}
                    </Text>
                  </View>
                </View>
                <Border />
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddBankInfo;
