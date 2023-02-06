import {
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  FlatList,
  Alert,
  Animated,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import {COLORS} from '../../../constants/theme';
import Feather from 'react-native-vector-icons/Feather';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import AuthContext from '../../../context/AuthContext';
import {FloatingAction} from 'react-native-floating-action';
import DropDown from '../../../components/common/DropDown/DropDown';
import Border from '../../../components/Border';
import NotificationService from '../../../services/NotificationService';
const StaffManagement = ({navigation}) => {
  const {host, userToken} = useContext(AuthContext);
  const [action, setAction] = useState(null);

  const [staffName, setStaffName] = useState(null);
  const [staffPhone, setStaffPhone] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [managers, setManagers] = useState(null);
  const [pitchSystems, setPitchSystems] = useState(null);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [user, setUser] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isSystemDelete, setIsSystemDelete] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const getManager = navigation.addListener('focus', () => {
      getManagers();
      getListPitchSystem();
    });
    return getManager;
  });

  const getManagers = () => {
    setIsLoading(true);
    fetch(`${host}/api/owner/manager/all`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        setIsLoading(false);
        setManagers(resJson.managers);
        console.log(resJson.managers);
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
        if (resJson.message == undefined) {
          setStaffName(resJson.user ? resJson.user.name : '');
          setIsAdmin(false);
        } else if (
          resJson.message == 'Quyền hạn của người dùng này không phù hợp'
        ) {
          setIsAdmin(true);
          Alert.alert('Lưu ý', resJson.message + '', [
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

  const addManager = () => {
    console.log(selectedSystem, staffPhone, staffName);
    if (selectedSystem && staffPhone && staffName) {
      fetch(`${host}/api/owner/manager/add/${selectedSystem.id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
        body: JSON.stringify({
          name: user ? user.name : staffName,
          phone: staffPhone,
          password: null,
          role: null,
        }),
      })
        .then(res => res.json())
        .then(resJson => {
          console.log(resJson.message);
          if (resJson.message == 'success') {
            Alert.alert('Thêm quản lý', 'Thêm quản lý thành công', [
              {
                text: 'Đóng',
                onPress: () => {
                  setStaffName(null);
                  setStaffPhone(null);
                  getManagers();
                },
                style: 'cancel',
              },
            ]);
          } else if (resJson.message.split('.')[0] == 'success') {
            console.log(resJson.message.split('.')[0], 'add new manager');
            NotificationService.displayLocalNotification(
              'Thêm quản lý mới',
              resJson.message.split('.')[1],
            );
            getManagers();
          } else {
            Alert.alert('Thêm quản lý', resJson.message, [
              {
                text: 'Đóng',
                onPress: () => {
                  getManagers();
                },
                style: 'cancel',
              },
            ]);
          }
        })
        .catch(error => {
          console.error(error);
        });
      getManagers();
      setIsModalVisible(false);
    }
  };

  const getListPitchSystem = () => {
    setIsLoading(true);
    fetch(`${host}/api/owner/pitch/systems`, {
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
        console.log(resJson.pitchSystems);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteManager = (system, manager) => {
    console.log('SysID', system.id, manager.id, 'ManaID');
    if (system && manager) {
      Alert.alert(
        'Xóa quyền quản lý khỏi hệ thống',
        'Bạn có chắc chắn muốn xóa quyền quản lý của ' +
          manager.name +
          ' khỏi hệ thống ' +
          system.name,
        [
          {
            text: 'Đóng',
            style: 'cancel',
          },
          {
            text: 'Xoá',
            onPress: () => {
              fetch(
                `${host}/api/owner/manager/delete/${system.id}/${manager.id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Token ' + userToken,
                  },
                },
              )
                .then(res => res.json())
                .then(resJson => {
                  console.log(resJson.message);
                  if (resJson.message == 'success') {
                    Alert.alert(
                      'Xóa quyền quản lý',
                      'Xoá quyền quản lý thành công',
                      [
                        {
                          text: 'Đóng',
                          onPress: () => {
                            getManagers();
                          },
                          style: 'cancel',
                        },
                      ],
                    );
                  } else {
                    Alert.alert(
                      'Xóa quyền quản lý khỏi hệ thống ' + system.name,
                      resJson.message,
                      [
                        {
                          text: 'Đóng',
                          onPress: () => {
                            getManagers();
                          },
                          style: 'cancel',
                        },
                      ],
                    );
                  }
                })
                .catch(error => {
                  console.error(error);
                });
            },
            style: 'cancel',
          },
        ],
      );
    }
  };

  const onFloatingActionPress = name => {
    if (name == 'bt_add_staff') {
      setAction('Thêm tài khoản quản lý');
      setIsModalVisible(true);
    }
    if (name == 'bt_remove_staff') {
      setIsSystemDelete(true);
    }
  };
  const actions = [
    {
      text: 'Xoá tài khoản nhân viên',
      icon: (
        <Feather
          name="user-x"
          style={{color: COLORS.dangerColor, fontSize: 22}}
        />
      ),
      name: 'bt_remove_staff',
      position: 1,
      color: COLORS.whiteColor,
      margin: 6,
    },
    {
      text: 'Thêm tài khoản nhân viên',
      icon: (
        <Feather
          name="user-plus"
          style={{color: COLORS.primaryColor, fontSize: 22}}
        />
      ),
      name: 'bt_add_staff',
      position: 2,
      color: COLORS.whiteColor,
      margin: 6,
    },
  ];

  const StaffItem = ({myItem}) => {
    return (
      <View
        style={[
          styles.staffItem,
          baseStyles.row,
          baseStyles.w100,
          baseStyles.centerVertically,
        ]}
      >
        <Image
          source={require('../../../assets/images/circled-user-male-skin-type-1-2.jpg')}
          style={{width: 50, height: 50, borderRadius: 50}}
        />

        <View style={[baseStyles.ml20, baseStyles.w75]}>
          <View
            style={[
              baseStyles.row,
              baseStyles.centerVertically,
              baseStyles.w100,
              baseStyles.spaceBetween,
            ]}
          >
            <Text style={[baseStyles.textBold, baseStyles.fontSize18]}>
              {myItem.name}
            </Text>
            <Text>
              {new Date(myItem.createdDate).toLocaleDateString('vi-VN')}
            </Text>
          </View>
          <View
            style={[
              baseStyles.row,
              baseStyles.w100,
              baseStyles.centerVertically,
            ]}
          >
            <View style={[baseStyles.w90]}>
              <Text>Quản lý các hệ thống</Text>
              <FlatList
                style={[baseStyles.w100]}
                data={myItem.systems}
                renderItem={({item}) => {
                  return (
                    <>
                      <View
                        style={[
                          baseStyles.row,
                          baseStyles.centerVertically,
                          baseStyles.spaceBetween,
                        ]}
                      >
                        <Text style={[baseStyles.textBold]}>{item.name}</Text>
                        <Pressable
                          onPress={() => deleteManager(item, myItem)}
                          style={baseStyles.p5}
                        >
                          <Feather
                            name="trash"
                            size={20}
                            style={{marginTop: 4, color: COLORS.dangerColor}}
                          />
                        </Pressable>
                      </View>
                      <Border />
                    </>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[baseStyles.root, {position: 'relative'}]}>
      <View style={baseStyles.w100}>
        {managers ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={managers}
            renderItem={({item}) => <StaffItem myItem={item} />}
          />
        ) : (
          <Text>Hiện tại chưa có quản lý nào</Text>
        )}
      </View>
      {isModalVisible && (
        <Animated.View style={[StyleSheet.absoluteFill, styles.cover]}>
          <Animated.View style={styles.modalContainer}>
            <Text style={[baseStyles.textBold, baseStyles.fontSize20]}>
              {action}
            </Text>

            <View
              style={[
                baseStyles.row,
                baseStyles.centerVertically,
                baseStyles.mt20,
                {position: 'relative'},
              ]}
            >
              <Feather name="smartphone" size={25} style={styles.icon} />
              <TextInput
                placeholder="Nhập số điện thoại của nhân viên"
                value={staffPhone}
                onChangeText={setStaffPhone}
                style={styles.textInput}
                keyboardType="number-pad"
                onEndEditing={() => getUserInfo(staffPhone)}
              />
            </View>
            <View
              style={[
                baseStyles.row,
                baseStyles.centerVertically,
                baseStyles.mb20,
                {position: 'relative'},
              ]}
            >
              <Feather name="user" size={25} style={styles.icon} />
              <TextInput
                placeholder="Nhập tên của nhân viên"
                value={staffName}
                onChangeText={setStaffName}
                style={styles.textInput}
              />
            </View>
            <DropDown
              data={pitchSystems && pitchSystems}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem.name);
                setSelectedSystem(selectedItem);
              }}
              label={'name'}
              selectLabel={'Chọn hệ thống'}
              width={'90%'}
            />
            <View
              style={[
                baseStyles.row,
                baseStyles.centerVertically,
                baseStyles.w100,
                baseStyles.spaceBetween,
                baseStyles.mv20,
              ]}
            >
              <CustomButton
                text="Đóng"
                onPress={() => setIsModalVisible(false)}
                type="DISABLED"
                width={'48%'}
              />
              <CustomButton
                text="Lưu"
                onPress={addManager}
                type={isAdmin ? 'DISABLED' : 'PRIMARY'}
                width={'48%'}
                disabled={isAdmin}
              />
            </View>
          </Animated.View>
        </Animated.View>
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

export default StaffManagement;
