import {
  Text,
  View,
  Pressable,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import baseStyles from '../../../constants/baseCss';
import {COLORS, SIZES} from '../../../constants/theme';
import AuthContext from '../../../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

import {FloatingAction} from 'react-native-floating-action';

const BankManagement = ({navigation}) => {
  const {host, userToken} = useContext(AuthContext);
  const [banks, setBanks] = useState(null);
  const [isDelete, setIsDelete] = useState(null);
  const [isEdit, setIsEdit] = useState(null);
  useEffect(() => {
    const getBanks = navigation.addListener('focus', () => {
      bankLists();
    });
    return getBanks;
  });

  const bankLists = () => {
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
        setBanks(resJson.bankings);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const editBank = bank => {
    navigation.navigate('AddBankInfo', {
      action: 'update',
      id: bank.id,
      name: bank.name,
      bin: bank.bin,
      bankingNumber: bank.bankingNumber,
    });
  };

  const deleteBank = id => {
    console.log(id);
    Alert.alert('Xóa tài khoản', 'Bạn có chắc chắn muốn xóa tài khoản này', [
      {
        text: 'Đóng',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        onPress: () => {
          fetch(`${host}/api/owner/banking/delete/${id}`, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Token ' + userToken,
            },
          })
            .then(res => res.json())
            .then(resJson => {
              if (resJson.message == 'success') {
                Alert.alert(
                  'Xóa tài khoản',
                  'Xoá tài khoản ngân hàng thành công',
                  [
                    {
                      text: 'Đóng',
                      onPress: () => bankLists(),
                      style: 'cancel',
                    },
                  ],
                );
              } else {
                Alert.alert('Xóa tài khoản', resJson.message, [
                  {
                    text: 'Đóng',
                    onPress: () => bankLists(),
                    style: 'cancel',
                  },
                ]);
              }
            })
            .catch(error => {
              console.error(error);
            });
        },
      },
    ]);
  };
  const onFloatingActionPress = name => {
    if (name == 'bt_add_bank') {
      navigation.navigate('AddBankInfo', {
        action: 'add',
        id: null,
        name: null,
        bin: null,
        bankingNumber: null,
      });
    } else if (name == 'bt_remove_bank') {
      setIsDelete(true);
      setIsEdit(false);
    } else if (name == 'bt_edit_bank') {
      setIsDelete(false);
      setIsEdit(true);
    }
  };
  const actions = [
    {
      text: 'Xóa tài khoản',
      icon: (
        <Feather
          name="trash"
          style={{color: COLORS.dangerColor, fontSize: 20}}
        />
      ),
      name: 'bt_remove_bank',
      position: 1,
      color: COLORS.whiteColor,
      margin: 6,
    },
    {
      text: 'Sửa thống tin tài khoản',
      icon: (
        <Feather name="edit" style={{color: COLORS.editColor, fontSize: 20}} />
      ),
      name: 'bt_edit_bank',
      position: 1,
      color: COLORS.whiteColor,
      margin: 6,
    },
    {
      text: 'Thêm tài khoản',
      icon: (
        <Ionicons
          name="ios-add"
          style={{color: COLORS.primaryColor, fontSize: 30}}
        />
      ),
      name: 'bt_add_bank',
      position: 2,
      color: COLORS.whiteColor,
      margin: 6,
    },
  ];

  const BankItem = ({item}) => {
    return (
      <Pressable
        onPress={() => {
          if (isDelete) {
            deleteBank(item.id);
          }
          if (isEdit) {
            editBank(item);
          }
        }}
        style={[styles.bankItem, baseStyles.row, baseStyles.spaceBetween]}
      >
        <View style={[baseStyles.row, baseStyles.centerVertically]}>
          <Image
            source={{uri: item.logo}}
            style={{width: 70, height: 30, marginRight: 4}}
          />
          <View>
            <Text style={{color: COLORS.blackColor}}>{item.name}</Text>
            <Text style={baseStyles.fontSize12}>{item.bankingNumber}</Text>
          </View>
        </View>
        {isDelete && (
          <Feather
            name="trash"
            size={22}
            style={{marginTop: 4, color: COLORS.dangerColor}}
          />
        )}
        {isEdit && (
          <Feather
            name="edit"
            size={22}
            style={{marginTop: 4, color: COLORS.editColor}}
          />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      {banks && banks.length > 0 ? (
        <View>
          <Text
            style={[
              baseStyles.fontSize16,
              baseStyles.textBold,
              baseStyles.mb20,
              {color: COLORS.dangerColor},
            ]}
          >
            Lưu ý thông tin tài khoản cần kiểm trả cẩn thận để tránh sự nhầm lẫn
            khi nhận giao dịch!
          </Text>
          <View style={[baseStyles.left]}>
            <Text style={[baseStyles.fontSize16, baseStyles.textBold]}>
              Tất cả số tài khoản hiện có
            </Text>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={baseStyles.w100}
            data={banks}
            renderItem={({item}) => <BankItem item={item} />}
          />
        </View>
      ) : (
        <Text style={[baseStyles.fontSize16, baseStyles.textBold]}>
          Hiện chưa có tài khoản ngân hàng nào.
        </Text>
      )}

      <FloatingAction
        position={'right'}
        color={COLORS.primaryColor}
        actions={actions}
        onPressItem={name => {
          onFloatingActionPress(name);
        }}
        shadow={{
          shadowOpacity: 0.35,
          shadowOffset: {width: 0, height: 5},
          shadowColor: '#000000',
          shadowRadius: 3,
        }}
        overlayColor={COLORS.overlayColor}
        buttonSize={50}
        iconWidth={20}
        iconHeight={20}
        distanceToEdge={20}
      />
    </SafeAreaView>
  );
};

export default BankManagement;
