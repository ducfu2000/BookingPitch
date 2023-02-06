import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  Animated,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../../../context/AuthContext';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import {COLORS, SIZES} from '../../../constants/theme';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';

import Feather from 'react-native-vector-icons/Feather';
import {FloatingAction} from 'react-native-floating-action';
const MyTeam = ({route, navigation}) => {
  const {teamId} = route.params;
  const {userToken, host} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [teamMembers, setTeamMembers] = useState(null);
  const [listPhoneNumbers, setListPhoneNumbers] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTeamDetail();
    });
    return unsubscribe;
  });

  const teamMemberExisted = _phone => {
    console.log('_phone :>> ', _phone);
    fetch(
      `${host}/api/tenant/team/member/existed?tid=${teamId}&phone=${_phone}`,
      {
        method: 'GET',
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
        if (resJson.message == 'Thành viên đã ở trong đội này') {
          Alert.alert('Thêm thành viên', 'Thành viên đã ở trong đội này', [
            {
              text: 'Đóng',
              style: 'cancel',
            },
          ]);
        } else if (resJson.message == 'valid') {
          getUserInfo(_phone);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getUserInfo = _phone => {
    fetch(`${host}/api/tenant/team/user/info?phone=${_phone}`, {
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
          setUser(resJson.user);
          setPhoneNumber(resJson.user.phone);
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
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getTeamDetail = () => {
    setIsLoading(true);
    fetch(`${host}/api/tenant/team/members/${teamId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson.members, 'clllllllllllllllllll');
        if (resJson.members) {
          setTeamMembers(resJson.members);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onAddTeamPress = () => {
    console.log('listPhoneNumbers :>> ', listPhoneNumbers);
    if (listPhoneNumbers) {
      fetch(`${host}/api/tenant/team/add`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
        body: JSON.stringify({
          tid: teamId,
          name: null,
          phones: listPhoneNumbers,
        }),
      })
        .then(res => res.json())
        .then(resJson => {
          console.log(resJson.message);
          Alert.alert('Thêm thành viên', resJson.message, [
            {
              text: 'Đóng',
              onPress: () => {
                setAddModalVisible(false);
                getTeamDetail();
              },
              style: 'cancel',
            },
          ]);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      Alert.alert('Thêm đội', '', [
        {
          text: 'Đóng',
          onPress: () => navigation.navigate('MyTeam'),
          style: 'cancel',
        },
      ]);
    }
  };

  const onLeaveTeam = () => {
    Alert.alert(
      'Rời khỏi đội',
      'Bạn có chắc rằng muốn rời khỏi đội này không',
      [
        {
          text: 'Đóng',
          style: 'cancel',
        },
        {
          text: 'Rời khỏi',
          onPress: () => {
            fetch(`${host}/api/tenant/team/leave/${teamId}`, {
              method: 'DELETE',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Token ' + userToken,
              },
            })
              .then(res => res.json())
              .then(resJson => {
                console.log(resJson.message);
                if (resJson.message == 'success') {
                  Alert.alert('Rời khỏi đội', 'Bạn đã rời khỏi đội', [
                    {
                      text: 'Đóng',
                      onPress: () => {
                        navigation.navigate('MyTeam');
                      },
                      style: 'cancel',
                    },
                  ]);
                } else {
                  Alert.alert('Rời khỏi đội', resJson.message, [
                    {
                      text: 'Đóng',
                      onPress: () => {
                        navigation.navigate('MyTeam');
                      },
                      style: 'cancel',
                    },
                  ]);
                }
              })
              .catch(error => {
                console.error(error);
              });
          },
          style: 'ok',
        },
      ],
    );
  };

  const addTeamMember = () => {
    setUsers(old => [...old, user]);
    setListPhoneNumbers(old => [...old, user.phone]);
    setUser(null);
    setPhoneNumber('');
  };
  // FloatingAction
  const actions = [
    {
      text: 'Rời khỏi đội',
      icon: (
        <Feather
          name="user-x"
          style={{color: COLORS.dangerColor, fontSize: 20}}
        />
      ),
      name: 'bt_remove_team',
      position: 1,
      color: COLORS.whiteColor,
      margin: 6,
    },
    {
      text: 'Thêm thành viên',
      icon: (
        <Feather
          name="user-plus"
          style={{color: COLORS.primaryColor, fontSize: 20}}
        />
      ),
      name: 'bt_add_members',
      position: 2,
      color: COLORS.whiteColor,
      margin: 6,
    },
  ];

  const onFloatingActionPress = name => {
    switch (name) {
      case 'bt_add_members':
        setAddModalVisible(true);
        break;
      case 'bt_remove_team':
        onLeaveTeam();
        break;
    }
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      {teamMembers && teamMembers.length > 0 && (
        <FlatList
          style={baseStyles.w100}
          data={teamMembers}
          renderItem={({item}) => (
            <View
              style={[
                styles.teamItem,
                baseStyles.row,
                baseStyles.centerVertically,
              ]}
            >
              <Image
                source={require('../../../assets/images/circled-user-male-skin-type-1-2.jpg')}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  marginRight: 20,
                }}
              />
              <Text style={[baseStyles.fontSize16, baseStyles.textBold]}>
                {item.name}
              </Text>
            </View>
          )}
        />
      )}
      {addModalVisible && (
        <>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.cover]}
          ></Animated.View>
          <Animated.View style={styles.addMemberModal}>
            <Feather
              style={styles.btnClose}
              onPress={() => setAddModalVisible(false)}
              name="x-circle"
              size={20}
            />

            <View style={baseStyles.row}>
              <CustomInput
                label="Số điện thoại"
                placeholder="Nhập số điện thoại các thành viên"
                value={phoneNumber}
                setValue={text => {
                  setPhoneNumber(text);
                  if (text.split('').length == 10) {
                    teamMemberExisted(text);
                  }
                }}
                keyboardType="number-pad"
              />
              <Pressable
                onPress={() => {
                  setPhoneNumber('');
                  setUser(null);
                }}
              >
                <Feather name="x" size={24} style={styles.icon} />
              </Pressable>
            </View>
            {user && (
              <Pressable
                onPress={() => addTeamMember()}
                style={[baseStyles.left, styles.userInfo]}
              >
                <Text>{user.name + ' - ' + user.phone}</Text>
                <Feather name="user-plus" size={20} />
              </Pressable>
            )}
            <View style={[baseStyles.left, baseStyles.w100]}>
              <FlatList
                data={users}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => {
                  return (
                    <View
                      style={[
                        baseStyles.left,
                        baseStyles.w100,
                        styles.userInfo,
                      ]}
                    >
                      <Text>{item.name + ' - ' + item.phone}</Text>
                    </View>
                  );
                }}
              />
            </View>
            <View style={styles.btnBottom}>
              <CustomButton
                text="Thêm thành viên"
                onPress={onAddTeamPress}
                type="PRIMARY"
              />
            </View>
          </Animated.View>
        </>
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

export default MyTeam;
