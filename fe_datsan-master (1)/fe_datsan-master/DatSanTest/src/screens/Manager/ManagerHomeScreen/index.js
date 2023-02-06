import {
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';

import AuthContext from '../../../context/AuthContext';
const ManagerHome = ({navigation}) => {
  const {host, userToken} = useContext(AuthContext);
  const [pitchSystems, setPitchSystems] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getSystems();
    });
    return unsubscribe;
  });

  const getSystems = () => {
    fetch(`${host}/api/manager/pitch/systems`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.pitchSystems) {
          setPitchSystems(resJson.pitchSystems);
          console.log(resJson.pitchSystems);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getBookings = () => {
    fetch(`${host}/api/manager/pitch/systems`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.booking) {
          console.log(resJson.booking);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onViewAllBookingsPress = sid => {
    navigation.navigate('OBookingList', {sid: sid, status: 'Pending'});
  };

  const onViewBookingDetailsPress = booking => {
    navigation.navigate('MBookingDetail', {
      bookingId: booking.id,
      backScreen: 'HomeForUser',
    });
  };

  const StaffItem = ({myItem}) => {
    return (
      <Pressable
        onPress={() => onViewAllBookingsPress(myItem.id)}
        style={[styles.managerItem, baseStyles.w100]}
      >
        <Text
          style={[baseStyles.textBold, baseStyles.fontSize18, baseStyles.mb5]}
        >
          Hệ thống sân {myItem.name}
        </Text>
        <Text>{myItem.owner.phone}</Text>
        <Text numberOfLines={2} style={[baseStyles.w100]}>
          {myItem.addressDetail ? myItem.addressDetail + ', ' : ''}
          {myItem.ward ? myItem.ward + ', ' : ''}
          {myItem.district ? myItem.district + ', ' : ''}
          {myItem.city ? myItem.city : ''}
        </Text>
        <FlatList
          style={[baseStyles.row, baseStyles.centerVertically, baseStyles.w50]}
          data={myItem.systems}
          renderItem={({item}) => {
            return <Text style={[baseStyles.textBold]}>{item + ', '}</Text>;
          }}
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      <Text
        style={[
          baseStyles.textBold,
          baseStyles.fontSize20,
          baseStyles.left,
          baseStyles.mb10,
        ]}
      >
        Danh sách các hệ thống
      </Text>
      <FlatList
        style={[baseStyles.w100]}
        keyboardShouldPersistTaps="always"
        data={pitchSystems}
        renderItem={({item}) => <StaffItem myItem={item} />}
      />
    </SafeAreaView>
  );
};

export default ManagerHome;
