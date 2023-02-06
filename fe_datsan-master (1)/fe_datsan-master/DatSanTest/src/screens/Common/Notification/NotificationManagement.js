import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Pressable,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import baseStyles from '../../../constants/baseCss';
import {COLORS} from '../../../constants';
import Entypo from 'react-native-vector-icons/Entypo';
import AuthContext from '../../../context/AuthContext';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DropDown from '../../../components/common/DropDown/DropDown';
import styles from './styles';

const NotificationManagement = ({navigation}) => {
  const {host, userToken, currentRole} = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNotifications();
    });

    return unsubscribe;
  });

  const getNotifications = () => {
    fetch(`${host}/api/common/notifications`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        console.log('notifications :>> ', resJson.notifications);
        if (resJson.notifications) {
          setNotifications(resJson.notifications);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const markAdRead = (notificationId, id) => {
    fetch(`${host}/api/common/notification/read/${notificationId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    }).catch(error => {
      console.error(error);
    });
    if (currentRole == 'owner' || currentRole == 'manager') {
      navigation.navigate('OBookingDetail', {
        bookingId: id,
        backScreen: 'NotificationManagement',
      });
    } else if (currentRole == 'tenant') {
      navigation.navigate('HistoryD', {id});
    }
  };

  const formatToHours = _date => {
    let d = new Date(_date);
    let dNow = new Date();
    let miniS = new Date(dNow - d).getTime();
    let hours = Math.trunc(miniS / 1000 / 60 / 60);
    if (hours <= 1) {
      return 'vài phút trước';
    } else if (hours <= 24) {
      return hours + ' giờ trước';
    } else if (Math.trunc(hours / 24) > 1 && Math.trunc(hours / 24) < 7) {
      return Math.trunc(hours / 24) + ' ngày trước';
    } else if (Math.trunc(hours / 168) >= 1 && Math.trunc(hours / 168) < 2) {
      return '1 tuần trước';
    } else {
      return 'vài tuần trước';
    }
  };
  return (
    <SafeAreaView style={styles.root}>
      <Text
        style={[
          baseStyles.fontSize16,
          baseStyles.textBold,
          baseStyles.mb10,
          baseStyles.ml10,
          {color: COLORS.blackColor},
        ]}
      >
        Thông báo mới
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={baseStyles.w100}
        data={notifications}
        renderItem={({item}) => (
          <Pressable
            onPress={() => markAdRead(item.id, item.bookingId)}
            style={[
              styles.notificationItem,
              {
                backgroundColor: item.isRead ? COLORS.whiteColor : '#E6FDDC',
              },
            ]}
          >
            <View style={[baseStyles.pv5]}>
              <Text style={[baseStyles.fontSize16, baseStyles.textBold]}>
                {item.title}
              </Text>
              <Text>{item.body}</Text>
            </View>
            <Text style={baseStyles.pb5}>{formatToHours(item.createdAt)}</Text>
            {item.isRead == false && (
              <Entypo name="dot-single" size={40} style={styles.isRead} />
            )}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default NotificationManagement;
