import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import baseStyles from '../../../constants/baseCss';
import {COLORS, SIZES} from '../../../constants/theme';
import AuthContext from '../../../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Shapes} from 'react-native-background-shapes';
import Border from '../../../components/Border';
import styles from './styles';

const ProfileSC = ({navigation}) => {
  const {
    host,
    userRole,
    userToken,
    signOut,
    setCurrentRole,
    currentRole,
  } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isItemOpen, setIsItemOpen] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserProfile();
    });

    return unsubscribe;
  });

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
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const profile = [
    {
      id: 1,
      text: 'Thông tin tài khoản',
      name: 'account_info',
      icon: (
        <FontAwesome5 name="info-circle" size={20} style={{color: '#2FA4FF'}} />
      ),
    },
  ];

  if (userRole && userRole[0] == 'OWNER') {
    profile.push({
      id: 2,
      text: 'Quản lý nhân sự',
      name: 'staff_manager',
      icon: <FontAwesome5 name="users" size={20} style={{color: '#7FBCD2'}} />,
      list: [],
    });
  }
  if (userRole && userRole.length <= 2 && userRole[0] == 'TENANT') {
    profile.push({
      id: 2,
      text: 'Lịch sử đặt sân',
      name: 'booking_history',
      icon: (
        <FontAwesome5 name="history" size={20} style={{color: '#FF731D'}} />
      ),
    });
  }
  if (userRole && userRole.length >= 2 && userRole[1] == 'MANAGER') {
    profile.push({
      id: 3,
      text: 'Chuyển vai trò',
      name: 'change_account',
      icon: (
        <FontAwesome5
          name="exchange-alt"
          size={20}
          style={{color: '#F47C7C'}}
        />
      ),
    });
  }
  const onItemPress = name => {
    if (name == 'account_info') {
      navigation.navigate('AccountInfo');
    }
    if (name == 'staff_manager') {
      navigation.navigate('StaffManagement');
    }
    if (name == 'booking_history') {
      navigation.navigate('History');
    }
    if (name == 'change_account') {
      if (currentRole == 'manager') {
        setCurrentRole(userRole[0].toLowerCase());
      } else if (currentRole == 'tenant') {
        setCurrentRole(userRole[1].toLowerCase());
      }
    }
  };

  const onProfileItemPress = myItem => {
    setIsItemOpen(myItem.id);
  };

  const renderItem = item => {
    return <Item myItem={item} />;
  };

  const Item = ({myItem}) => {
    return (
      <View>
        <Pressable
          onPress={() => {
            onItemPress(myItem.name);
          }}
          style={[baseStyles.row, styles.profileItem, baseStyles.spaceBetween]}
        >
          <View style={[baseStyles.centerVertically, baseStyles.row]}>
            <View style={{width: 30}}>{myItem && myItem.icon}</View>
            <Text style={[baseStyles.fontSize16]}>
              {' '}
              {myItem && myItem.text}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={22} />
        </Pressable>
        <FlatList
          data={isItemOpen == myItem.id ? myItem.list : []}
          renderItem={({item}) => (
            <View>
              <View
                style={[
                  baseStyles.spaceBetween,
                  baseStyles.row,
                  baseStyles.ph30,
                  baseStyles.pv5,
                ]}
              >
                <Text>{item.name}</Text>
              </View>
              <Border />
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      <Shapes
        primaryColor={COLORS.primaryColor}
        secondaryColor={COLORS.lightGreenColor}
        height={3}
        borderRadius={20}
        figures={[
          {name: 'circle', position: 'center', size: 60},
          {name: 'donut', position: 'flex-start', axis: 'top', size: 80},
          {name: 'circle', position: 'center', axis: 'right', size: 100},
        ]}
      />

      <View
        style={[baseStyles.left, baseStyles.row, baseStyles.centerVertically]}
      >
        <Image
          source={require('../../../assets/images/circled-user-male-skin-type-1-2.jpg')}
          style={{width: 80, height: 80, borderRadius: 50}}
        />
        <View style={[baseStyles.ml10]}>
          <Text style={[baseStyles.fontSize18, baseStyles.textBold]}>
            {user && user.name}
          </Text>
        </View>
      </View>
      <View style={[styles.bookingType, baseStyles.row]}>
        {currentRole && (currentRole == 'owner' || currentRole == 'manager') && (
          <Pressable
            style={[baseStyles.centerVertically, baseStyles.w25]}
            onPress={() => {
              navigation.navigate('OBookingList', {
                sid: null,
                status: 'Awaiting payment',
              });
            }}
          >
            <Ionicons
              name="ios-wallet-outline"
              size={30}
              style={{color: '#FED049'}}
            />
            <Text style={[baseStyles.fontSize12, baseStyles.mt10]}>
              Chờ thanh toán
            </Text>
          </Pressable>
        )}
        <Pressable
          style={[baseStyles.centerVertically, baseStyles.w25]}
          onPress={() => {
            if (currentRole == 'owner' || currentRole == 'manager') {
              navigation.navigate('OBookingList', {
                sid: null,
                status: 'Pending',
              });
            } else if (currentRole == 'tenant') {
              navigation.navigate('HistoryPe');
            }
          }}
        >
          <Ionicons
            name="checkmark-sharp"
            size={30}
            style={{color: COLORS.editColor}}
          />
          <Text style={[baseStyles.fontSize12, baseStyles.mt10]}>
            Chờ xác nhận
          </Text>
        </Pressable>
        <Pressable
          style={[baseStyles.centerVertically, baseStyles.w25]}
          onPress={() => {
            if (currentRole == 'owner' || currentRole == 'manager') {
              navigation.navigate('OBookingList', {
                sid: null,
                status: 'Confirmed',
              });
            } else if (currentRole == 'tenant') {
              navigation.navigate('HistoryCf');
            }
          }}
        >
          <Ionicons
            name="ios-checkmark-circle-outline"
            size={30}
            style={{color: COLORS.primaryColor}}
          />
          <Text style={[baseStyles.fontSize12, baseStyles.mt10]}>
            Đã xác nhận
          </Text>
        </Pressable>
        <Pressable
          style={[baseStyles.centerVertically, baseStyles.w25]}
          onPress={() => {
            if (currentRole == 'owner' || currentRole == 'manager') {
              navigation.navigate('OBookingList', {
                sid: null,
                status: 'Rejected',
              });
            } else if (currentRole == 'tenant') {
              navigation.navigate('HistoryRj');
            }
          }}
        >
          <Feather name="x" size={32} style={{color: COLORS.dangerColor}} />
          <Text style={[baseStyles.fontSize12, baseStyles.mt10]}>Đã hủy</Text>
        </Pressable>
        {currentRole && currentRole == 'tenant' && (
          <Pressable
            style={[baseStyles.centerVertically, baseStyles.w25]}
            onPress={() => {
              navigation.navigate('HistoryCf');
            }}
          >
            <AntDesign
              name="staro"
              size={30}
              style={{color: COLORS.yellowColor}}
            />
            <Text style={[baseStyles.fontSize12, baseStyles.mt10]}>
              Đánh giá
            </Text>
          </Pressable>
        )}
      </View>
      <View style={[baseStyles.w100, styles.profileList]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={profile}
          renderItem={({item}) => renderItem(item)}
        />
      </View>
      <View style={[styles.signOut, baseStyles.w100, baseStyles.row]}>
        <CustomButton
          text={'Đăng xuất'}
          type="DANGER"
          onPress={() => {
            signOut();
          }}
          width={'100%'}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileSC;
