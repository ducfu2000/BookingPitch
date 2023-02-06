import React, {useState, useContext, useEffect} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContext from '../../../context/AuthContext';
import moment from 'moment';
import baseStyles from '../../../constants/baseCss';
import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';

import CustomButton from '../../../components/common/CustomButton';
const {width} = Dimensions.get('screen');
const DetailPitchScreen = ({navigation, route}) => {
  const [pitchDetailSc, setPitchDetailSc] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookingNote, setBookingNote] = useState('');

  const {userToken, host} = useContext(AuthContext);
  const detail = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [bookingDetails, setBookingDetails] = useState('');
  const [checkDisable, setCheckDisable] = useState(false);
  const [checkEnsable, setCheckEnable] = useState(false);
  const [checkRate, setCheckRate] = useState('');

  const hints = [
    {
      text: 'Tôi có việc gấp',
      selected: false,
    },
    {
      text: 'Tôi muốn thay đổi giờ đặt sân',
      selected: false,
    },
    {
      text: 'Tôi muốn thay đổi địa điểm',
      selected: false,
    },
    {
      text: 'Tôi đặt nhầm',
      selected: false,
    },
  ];

  const BookingDetail = () => {
    fetch(`${host}/api/booking/detail/${detail.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setBookingDetails(responseJson.booking);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const DeleteBooking = () => {
    fetch(`${host}/api/booking/reject`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        id: detail.id,
        reason: bookingNote,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.message);
        console.log(bookingDetails.status);
        alertMessage(
          'Thông báo',
          `Bạn đã huỷ sân thành công với lý do ${bookingNote}`,
          'Đóng',
        );
        navigation.goBack();
      })
      .catch(error => {
        console.error(error);
      });
  };
  const checkRating = () => {
    fetch(`${host}/api/tenant/rating/enable/${bookingDetails.systemId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setCheckRate(responseJson.message);
        if (bookingDetails.enableRating === true) {
          if (responseJson.message === 'enable') {
            navigation.navigate('FeedBackListDetails', bookingDetails);
          } else {
            alertMessage('Thông báo', `Bạn đá đánh giá sân này`, 'Đóng');
            setCheckDisable(false);
          }
        } else {
          alertMessage('Thông báo', `Bạn chưa đá sân này`, 'Đóng');
          console.log();
          setCheckDisable(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    BookingDetail();
    console.log(detail.id);
  }, []);

  const alertMessage = (title, message, cancelBtn) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelBtn,
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };
  const renderContent = () => {
    return (
      <View>
        <TextInput
          style={{
            marginTop: 10,
            height: 50,
            margin: 20,
            padding: 10,
            borderColor: 'gray',
            borderWidth: 1,
          }}
          value={bookingNote}
          placeholder="Nhập lý do huỷ sân"
          multiline={true}
          borderBottomColor="green"
          borderBottomWidth={1}
          borderLeftColor="green"
          borderLeftWidth={1}
          borderRightColor="green"
          borderRightWidth={1}
          editable={true}
          returnKeyType="done"
          onChangeText={text => {
            setBookingNote(text);
          }}
        />
        <View style={[baseStyles.w100, baseStyles.ph20]}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={baseStyles.mb20}
            data={hints}
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => setBookingNote(item.text)}
                style={[baseStyles.mr20, styles.hintItem]}
              >
                <Text>{item.text}</Text>
              </Pressable>
            )}
          />
        </View>
        <View style={[baseStyles.ph20, baseStyles.mb20]}>
          <CustomButton
            text="Huỷ Sân"
            onPress={() => {
              setShowModal(!showModal);
              DeleteBooking();
            }}
            type="DANGER"
            width="100%"
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <ImageBackground
          source={require('../../../assets/images/fb-pitch1.jpg')}
          style={{width: '100%', height: 300}}
        ></ImageBackground>
        <View
          style={{
            backgroundColor: COLORS.white,
            paddingTop: 10,
            paddingLeft: 5,

            borderRadius: 10 * 3,
            bottom: 10 * 3,
            flex: 1,
          }}
        >
          <View style={{marginVertical: 10 * 2}}>
            <TouchableOpacity
              style={{paddingVertical: 10, marginRight: 10 * 2}}
            >
              <View style={{bottom: 30, paddingLeft: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={require('../../../assets/images/fb-pitch1.jpg')}
                    style={{height: 50, width: 50, borderRadius: 50 / 2}}
                  />
                  <View style={{flex: 1, paddingLeft: 7}}>
                    <Text
                      style={[
                        style.facilityText,
                        {
                          fontSize: SIZES.h7,
                          color: COLORS.blackColor,
                        },
                      ]}
                    >
                      Tên Sân: {bookingDetails.pitchName} (
                      {bookingDetails.systemName})
                    </Text>

                    <Text
                      style={[
                        style.facilityText,
                        {
                          fontSize: SIZES.h7,
                          color: COLORS.blackColor,
                        },
                      ]}
                    >
                      Ngày đặt:{' '}
                      {moment(bookingDetails.rentDate).format('DD/MM/yyyy')}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{marginBottom: 10 * 2, bottom: 20, left: 5}}>
              <TouchableOpacity
                style={{paddingVertical: 10, marginRight: 10 * 2}}
              >
                <Text
                  style={{
                    color: COLORS.black,
                    fontWeight: 'bold',
                    fontSize: 10 * 1.7,
                    bottom: 10 * 2,
                  }}
                >
                  Thông tin tổng quan
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginBottom: 10 * 2,
                flexDirection: 'row',
                bottom: 10 * 6,
                left: 5,
              }}
            >
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    shadowColor: COLORS.dark,
                    shadowOffset: {width: 10 / 2, height: 10},
                    shadowRadius: 10 / 2,
                    shadowOpacity: 0.1,
                    padding: 10 / 2,
                    borderRadius: 10 / 2,
                    marginRight: 10,
                  }}
                >
                  <MaterialIcons
                    name="clock-check"
                    size={10 * 3}
                    color={COLORS.primaryColor}
                  />
                </View>
                <View style={{marginRight: 10 * 5}}>
                  <Text
                    style={{
                      fontSize: 10 + 1,
                      marginBottom: 10 / 2,
                      textTransform: 'uppercase',
                    }}
                  >
                    Giờ đặt:
                  </Text>
                  <Text style={{fontSize: 14, fontWeight: '700'}}>
                    {bookingDetails.rentStart} - {bookingDetails.rentEnd}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', right: 26}}>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    shadowColor: COLORS.dark,
                    shadowOffset: {width: 10 / 2, height: 10},
                    shadowRadius: 10 / 2,
                    shadowOpacity: 0.1,
                    padding: 10 / 2,
                    borderRadius: 10 / 2,
                    marginRight: 10,
                  }}
                >
                  <MaterialIcons
                    name="calendar-outline"
                    size={10 * 3}
                    color={COLORS.primaryColor}
                  />
                </View>
                <View style={{marginRight: 10 * 2}}>
                  <Text
                    style={{
                      fontSize: 10 + 1,
                      marginBottom: 10 / 2,
                      textTransform: 'uppercase',
                    }}
                  >
                    Ngày đá:
                  </Text>
                  <Text style={{fontSize: 14, fontWeight: '700'}}>
                    {moment(bookingDetails.rentDate).format('DD/MM/yyyy')}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.container, {bottom: 10 * 8}]}>
              <TouchableOpacity
                style={{paddingVertical: 5, marginRight: 10 * 2}}
              >
                <Text
                  style={{
                    color: COLORS.black,
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}
                >
                  Ghi chú:
                </Text>
                <Text
                  style={{
                    width: 400,
                    height: 50,
                  }}
                >
                  {bookingDetails.note ? bookingDetails.note : 'không có'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.container, {bottom: 100}]}>
              <View style={{marginTop: 5}}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: COLORS.blackColor,
                  }}
                >
                  Ảnh thanh toán:
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                {bookingDetails.status === 'Confirmed' ||
                bookingDetails.status === 'Pending' ? (
                  <View style={{paddingHorizontal: 20, paddingVertical: 30}}>
                    <Image
                      source={{uri: bookingDetails.payment}}
                      style={{
                        width: 250,
                        height: 200,
                        borderRadius: 5,
                        borderColor: COLORS.grayColor,
                        borderWidth: 1,
                      }}
                    />
                  </View>
                ) : (
                  <Text style={{}}>Hiện chưa có hình ảnh thanh toán</Text>
                )}
              </View>

              <View
                style={[
                  baseStyles.row,
                  baseStyles.centerVertically,
                  baseStyles.spaceBetween,
                  baseStyles.mh20,
                  baseStyles.mb20,
                  baseStyles.ph10,
                  {},
                ]}
              >
                {/* button */}
                <CustomButton
                  onPress={() => {
                    if (bookingDetails.status === 'Confirmed') {
                      setCheckDisable(true);
                      checkRating();
                      setCheckDisable(false);
                    } else {
                      setCheckDisable(false);
                    }
                  }}
                  text="Đánh giá"
                  width="45%"
                  type={
                    bookingDetails.status === 'Confirmed'
                      ? 'PRIMARY'
                      : 'DISABLED'
                  }
                  disabled={checkDisable}
                />
                <CustomButton
                  text="Huỷ Sân"
                  onPress={() => {
                    if (bookingDetails.status === 'Awaiting payment') {
                      setCheckEnable(true);
                      setShowModal(!showModal);
                      console.log('sau khi ấn huỷ sân' + checkEnsable);
                    } else {
                      setCheckEnable(false);
                    }
                  }}
                  type={
                    bookingDetails.status === 'Awaiting payment'
                      ? 'DANGER'
                      : 'DISABLED'
                  }
                  disabled={checkEnsable}
                  width="45%"
                />
                <Modal
                  animationType={'fade'}
                  transparent={true}
                  visible={showModal}
                  onBackButtonPress={true}
                  onRequestClose={() => {}}
                >
                  <View style={{flex: 1, backgroundColor: '#000000AA'}}>
                    <Pressable
                      onPress={() => {
                        if (!showModal) return;
                        setShowModal(!showModal);
                        setCheckEnable(false);
                      }}
                      style={{flex: 1}}
                    ></Pressable>
                    <View
                      style={{
                        bottom: 0,
                        position: 'absolute',
                        width: '100%',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        maxHeight: Dimensions.get('window').height * 1,
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: 'center',
                          color: '#182E44',
                          fontSize: 20,
                          fontWeight: '500',
                          margin: 15,
                        }}
                      >
                        Lý do bạn huỷ sân:
                      </Text>

                      {renderContent()}
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 10 * 2,
          width: '100%',
          backgroundColor: COLORS.whiteColor,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.grayColor,
            padding: 10 * 1.5,
            marginHorizontal: 10 * 1.6,
            borderRadius: 10 * 2,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 10 * 2,
              fontWeight: 'bold',
              marginRight: 10 * 4,
              marginLeft: 10 * 4,
            }}
          >
            Tổng giá:{' '}
            {Number(bookingDetails.totalPrice).toLocaleString('vi', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  submit: {
    backgroundColor: COLORS.primaryColor,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 15,
    bottom: 10,
    right: 15,
  },
  submitText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
    backgroundColor: COLORS.primaryColor,
  },
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.blackColor,
    fontSize: 16,
  },
  texts: {textAlign: 'center'},
  hintItem: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: COLORS.editColor,
  },
  hintActive: {
    backgroundColor: '#f0ece3',
  },
});
const style = StyleSheet.create({
  underline: {
    width: 280,
    height: 3,
    backgroundColor: COLORS.primaryColor,
    marginTop: 1,
    marginLeft: 35,
  },
  underlines: {
    width: 50,
    height: 3,
    backgroundColor: COLORS.primaryColor,
    marginTop: 1,
    marginLeft: 5,
  },
  btn: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  facility: {flexDirection: 'row', marginRight: 10, marginTop: 5},
  facilityText: {marginLeft: 2, color: COLORS.grey},
  priceTag: {
    height: 40,
    alignItems: 'center',
    marginLeft: 40,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: 'row',
  },
  iconContainer: {
    position: 'absolute',
    height: 60,
    width: 60,
    backgroundColor: COLORS.primary,
    top: -30,
    right: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    height: 150,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    overflow: 'hidden',
  },
  header: {
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },
});
export default DetailPitchScreen;
