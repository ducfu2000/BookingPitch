import {
  Text,
  View,
  Pressable,
  SafeAreaView,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import {COLORS, SIZES} from '../../../constants/theme';
import Feather from 'react-native-vector-icons/Feather';
import AuthContext from '../../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FloatingAction} from 'react-native-floating-action';

const PitchManagementScreen = ({navigation}) => {
  const {userToken, host} = useContext(AuthContext);

  const [pitchSystems, setPitchSystems] = useState([]);
  const [pitchSystemsPending, setPitchSystemsPending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getListPitchSystem();
      getListPitchSystemPending();
    });

    return unsubscribe;
  });

  const actions = [
    {
      text: 'Đăng ký hệ thống sân',
      icon: (
        <Ionicons
          name="ios-add"
          style={{color: COLORS.primaryColor, fontSize: 30}}
        />
      ),
      name: 'bt_add_system_pitch',
      position: 2,
      color: COLORS.whiteColor,
      margin: 6,
    },
  ];

  const onFloatingActionPress = name => {
    if (name == 'bt_add_system_pitch') {
      navigation.navigate('AddSystemPitch', {
        action: 'add',
        systemName: null,
        city: null,
        district: null,
        ward: null,
        addressDetail: null,
        description: null,
        hiredStart: null,
        hiredEnd: null,
      });
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
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getListPitchSystemPending = () => {
    setIsLoading(true);
    fetch(`${host}/api/owner/system/pending`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        setPitchSystemsPending(resJson.systems);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSystemPitchPress = pitchSystem => {
    navigation.navigate('PitchManagementSC', {
      pitchSystemId: pitchSystem.id,
    });
  };

  const Item = ({status, myItem}) => {
    return (
      <Pressable
        style={[baseStyles.pv5, baseStyles.ph20]}
        onPress={() => onSystemPitchPress(myItem)}
      >
        <View style={[baseStyles.row]}>
          <View>
            <Image
              style={[styles.pSImage]}
              source={
                myItem.image
                  ? {uri: myItem.image}
                  : require('../../../assets/images/pitch.png')
              }
            />
          </View>
          <View
            style={[
              baseStyles.row,
              baseStyles.w100,
              baseStyles.centerVertically,
            ]}
          >
            <View style={[baseStyles.ml10, baseStyles.w50]}>
              <Text style={[styles.pSTitle]}>{myItem.name}</Text>
              {status != 'Pending' ? (
                <Text>
                  Đánh giá:{' '}
                  {myItem.rate == 0 ? 'chưa có đánh giá' : myItem.rate}
                </Text>
              ) : (
                <Text style={[{color: COLORS.editColor}]}>Đang chờ duyệt</Text>
              )}
            </View>
            {status != 'Pending' && (
              <Feather
                style={[
                  styles.itemIcon,
                  {color: COLORS.editColor, marginLeft: 40},
                ]}
                name="edit"
              />
            )}
          </View>
        </View>
        <Border />
      </Pressable>
    );
  };

  const Border = () => {
    return (
      <View style={[styles.borderContainer, baseStyles.mv10]}>
        <View style={styles.border} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[baseStyles.root]}>
      <View style={[baseStyles.w100, styles.contentBody]}>
        <View style={[baseStyles.row]}>
          <Text style={[{fontSize: SIZES.h4, color: COLORS.blackColor}]}>
            Danh sách hệ thống sân
          </Text>
          <Text style={styles.itemRight}>
            Số hệ thống sân: {pitchSystems && pitchSystems.length}
          </Text>
        </View>
        <Border />
        {isLoading && pitchSystems.length == 0 && (
          <ActivityIndicator size="large" />
        )}
        {pitchSystems && pitchSystems.length == 0 ? (
          <Text>Hiện tại chưa có hệ thống nào</Text>
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={pitchSystems}
            renderItem={({item}) => <Item status="Accept" myItem={item} />}
            keyExtractor={item => item.id}
          />
        )}

        {pitchSystemsPending && pitchSystemsPending.length > 0 && (
          <>
            <Text
              style={[
                baseStyles.fontSize16,
                baseStyles.textBold,
                baseStyles.mv10,
              ]}
            >
              Đang chờ duyệt
            </Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={pitchSystemsPending}
              renderItem={({item}) => <Item status="Pending" myItem={item} />}
              keyExtractor={item => item.id}
            />
          </>
        )}
      </View>
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

export default PitchManagementScreen;
