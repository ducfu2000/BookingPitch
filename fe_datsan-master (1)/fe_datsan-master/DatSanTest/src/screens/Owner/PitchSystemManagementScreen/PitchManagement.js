import {
  Text,
  View,
  Pressable,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import {COLORS, SIZES} from '../../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AuthContext from '../../../context/AuthContext';
import {FloatingAction} from 'react-native-floating-action';

const PitchManagementScreen = ({route, navigation}) => {
  const {userToken, host} = useContext(AuthContext);
  const {pitchSystemId} = route.params;
  const [pitchSystem, setPitchSystem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPitchSystemDetail();
    });

    return unsubscribe;
  });

  // FloatingAction
  const actions = [
    {
      text: 'Xóa hệ thống sân',
      icon: (
        <Feather
          name="trash"
          style={{color: COLORS.dangerColor, fontSize: 20}}
        />
      ),
      name: 'bt_remove_ps',
      position: 1,
      color: COLORS.whiteColor,
      margin: 6,
    },
    {
      text: 'Sửa hệ thống sân',
      icon: (
        <Feather name="edit" style={{color: COLORS.editColor, fontSize: 20}} />
      ),
      name: 'bt_edit_ps',
      position: 1,
      color: COLORS.whiteColor,
      margin: 6,
    },
    {
      text: 'Thêm sân',
      icon: (
        <Ionicons
          name="ios-add"
          style={{color: COLORS.primaryColor, fontSize: 30}}
        />
      ),
      name: 'bt_add_pitch',
      position: 2,
      color: COLORS.whiteColor,
      margin: 6,
    },
  ];

  const onFloatingActionPress = name => {
    switch (name) {
      case 'bt_add_pitch':
        onAddPitchPress();
        break;
      case 'bt_edit_ps':
        onUpdatePitchSystemPress();
        break;
      case 'bt_remove_ps':
        onDeletePitchSystemPress();
        break;
    }
  };

  // Pitch actions
  const getPitchSystemDetail = () => {
    setIsLoading(true);
    fetch(`${host}/api/manager/system/detail/${pitchSystemId}`, {
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
        setPitchSystem(resJson.system);
        console.log(resJson.system);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deletePitchSystem = () => {
    fetch(`${host}/api/owner/system/delete/${pitchSystemId}`, {
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
            'Xoá hệ thống sân ',
            'Xóa hệ thống sân ' + pitchSystem.name + ' thành công',
            [
              {
                text: 'Đóng',
                style: 'cancel',
              },
              {
                text: 'Xóa',
                onPress: () => navigation.navigate('PitchSystemManagement'),
                style: 'delete',
              },
            ],
            {
              cancelable: true,
            },
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onAddPitchPress = () => {
    navigation.navigate('AddPitch', {
      action: 'add',
      timeStart: '',
      timeEnd: '',
      price: '',
      isWeekend: false,
      pitchSystemId: pitchSystemId,
    });
  };

  const onDeletePitchSystemPress = () => {
    Alert.alert(
      'Xoá hệ thống sân',
      'Bạn có chắc là xóa hệ thông sân ' + pitchSystem.name,
      [
        {
          text: 'Đóng',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => deletePitchSystem(),
          style: 'delete',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const onUpdatePitchSystemPress = () => {
    navigation.navigate('AddSystemPitch', {
      pitchSystemId: pitchSystemId,
      action: 'update',
      systemName: pitchSystem.name,
      city: pitchSystem.city,
      district: pitchSystem.district,
      ward: pitchSystem.ward,
      addressDetail: pitchSystem.addressDetail,
      description: pitchSystem.description,
      hiredStart: pitchSystem.hiredStart,
      hiredEnd: pitchSystem.hiredEnd,
    });
  };

  const onPitchDetailPress = pitchId => {
    navigation.navigate('AddPitch', {
      pitchSystemId: pitchSystemId,
      pitchId: pitchId,
      action: 'update',
    });
  };

  const deletePitch = pitchId => {
    fetch(`${host}/api/owner/pitch/delete/${pitchId}`, {
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
            'Xoá sân',
            'Xoá sân thành công',
            [
              {
                text: 'Đóng',
                onPress: () => getPitchSystemDetail(),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        } else {
          Alert.alert(
            'Xoá sân',
            resJson.message,
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
        }
        console.log(resJson.message);
        // alert(JSON.stringify(resJson.pitchSystem));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onDeletePitchPress = pitch => {
    Alert.alert(
      'Xoá sân',
      'Bạn có chắc là xóa sân ' + pitch.name,
      [
        {
          text: 'Đóng',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => deletePitch(pitch.id),
          style: 'delete',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const Item = ({myItem}) => {
    return (
      <View style={[baseStyles.pv5, baseStyles.w100]}>
        <View style={[baseStyles.row]}>
          <View>
            <Image
              style={[styles.pSImage]}
              source={
                myItem.image
                  ? {
                      uri: myItem.image,
                    }
                  : require('../../../assets/images/pitch.png')
              }
            />
          </View>
          <View style={[baseStyles.ml10]}>
            <Text style={[styles.pSTitle]}>{myItem.name}</Text>
            <View style={baseStyles.row}>
              <Text style={baseStyles.w75}>
                {myItem.grass} | {myItem.type}v{myItem.type} |{' '}
                {myItem.unitPrices &&
                  myItem.unitPrices[0].price.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
              </Text>
            </View>
          </View>
          <View style={[styles.footerBtn, baseStyles.row]}>
            <Pressable
              onPress={() => {
                onDeletePitchPress(myItem);
              }}
            >
              <Feather
                style={[
                  styles.itemIcon,
                  {color: COLORS.dangerColor},
                  baseStyles.mr20,
                ]}
                name="trash"
              />
            </Pressable>
            <Pressable
              onPress={() => {
                onPitchDetailPress(myItem.id);
              }}
            >
              <Feather
                style={[styles.itemIcon, {color: COLORS.editColor}]}
                name="edit"
              />
            </Pressable>
          </View>
        </View>
        <Border />
      </View>
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
      {isLoading && (
        <View
          style={[
            {flex: 1},
            baseStyles.centerVertically,
            baseStyles.centerHorizontal,
          ]}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      {pitchSystem && (
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          style={[baseStyles.w100]}
        >
          <View style={[baseStyles.w100, styles.contentBody]}>
            <View style={[baseStyles.row, baseStyles.centerVertically]}>
              <Text
                numberOfLines={1}
                style={[
                  {fontSize: SIZES.h4, color: COLORS.blackColor},
                  baseStyles.w75,
                ]}
              >
                Hệ thống sân {pitchSystem.name}
              </Text>
              <Pressable
                onPress={() => setIsOpen(!isOpen)}
                style={[
                  baseStyles.row,
                  baseStyles.centerVertically,
                  styles.itemRight,
                ]}
              >
                <Text>{isOpen ? 'Ẩn bớt' : 'Xem chi tiết'}</Text>
                <MaterialIcons
                  name={isOpen ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
                  size={22}
                />
              </Pressable>
            </View>
            {isOpen && (
              <Animated.View>
                <Animated.View
                  style={[
                    baseStyles.w100,
                    baseStyles.centerVertically,
                    baseStyles.mv10,
                  ]}
                >
                  <Image
                    source={
                      pitchSystem.image
                        ? {uri: pitchSystem.image}
                        : require('../../../assets/images/pitch.png')
                    }
                    style={[{width: 180, height: 100}]}
                  />
                </Animated.View>
                <Animated.View>
                  <Text style={[baseStyles.fontSize16, baseStyles.textBold]}>
                    Địa chỉ
                  </Text>
                  <Text style={[baseStyles.fontSize14]}>
                    {pitchSystem.addressDetail}
                    {', ' + pitchSystem.ward}
                    {', ' + pitchSystem.district}
                    {', ' + pitchSystem.city}
                  </Text>
                  <View
                    style={[
                      baseStyles.row,
                      baseStyles.centerVertically,
                      baseStyles.spaceBetween,
                      baseStyles.mt10,
                    ]}
                  >
                    <Text>Thời gian hoạt động: </Text>
                    <Text style={baseStyles.textBold}>
                      {pitchSystem.hiredStart + ' -> ' + pitchSystem.hiredEnd}
                    </Text>
                  </View>
                  {pitchSystem.price.split(' - ')[0] !== 'null' &&
                    pitchSystem.price.split(' - ')[1] !== 'null' && (
                      <View
                        style={[
                          baseStyles.row,
                          baseStyles.centerVertically,
                          baseStyles.spaceBetween,
                        ]}
                      >
                        <Text>Khoảng giá của các sân: </Text>
                        <Text style={baseStyles.textBold}>
                          {Number(
                            pitchSystem.price.split(' - ')[0],
                          ).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }) +
                            ' - ' +
                            Number(
                              pitchSystem.price.split(' - ')[1],
                            ).toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                        </Text>
                      </View>
                    )}
                  <View
                    style={[
                      baseStyles.row,
                      baseStyles.centerVertically,
                      baseStyles.spaceBetween,
                    ]}
                  >
                    <Text>Đánh giá: {pitchSystem.rate}</Text>
                    <Text>
                      Số lượng sân giới hạn: {pitchSystem.pitchQuantity}
                    </Text>
                  </View>
                  {pitchSystem.ratings != null && (
                    <Pressable
                      onPress={() =>
                        navigation.navigate('RatingList', {
                          ratingList: pitchSystem.ratings,
                        })
                      }
                      style={[baseStyles.row, baseStyles.centerVertically]}
                    >
                      <Text
                        style={[baseStyles.fontSize16, baseStyles.textBold]}
                      >
                        Danh sách đánh giá
                      </Text>
                      <MaterialIcons name={'keyboard-arrow-right'} size={25} />
                    </Pressable>
                  )}
                </Animated.View>
              </Animated.View>
            )}
            <Border />
            {!pitchSystem ? (
              <Text>Hiện tại chưa có sân nào</Text>
            ) : (
              <FlatList
                style={baseStyles.mb20}
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                data={pitchSystem.pitches}
                renderItem={({item}) => <Item myItem={item} />}
                keyExtractor={item => item.id}
              />
            )}
          </View>
        </ScrollView>
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

export default PitchManagementScreen;
