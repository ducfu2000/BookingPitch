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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import {Rating, RatingInput} from 'react-native-stock-star-rating';
import AuthContext from '../../../context/AuthContext';
import moment from 'moment';
import baseStyles from '../../../constants/baseCss';
import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';

import CustomButton from '../../../components/common/CustomButton';

const FeebackListDetail = ({navigation, route}) => {
  const [rating, setRating] = React.useState(0);
  const {userToken, host} = useContext(AuthContext);
  const detail = route.params;
  const [bookingDetails, setBookingDetails] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [enableRating, setEnableRating] = useState(false);

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
  const AddFeedBack = () => {
    fetch(`${host}/api/tenant/rating/add/${bookingDetails.systemId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        rate: rating,
        content: bookingNote,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (bookingDetails.enableRating == true) {
          setEnableRating(true);
          setRating(0);
          setBookingNote('');
          alertMessage('Thông báo', 'Bạn đã đánh giá thành công', 'Đóng');

          navigation.navigate('HistoryCf');
        } else {
          setEnableRating(false);
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
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 10 * 2,
                fontWeight: 'bold',
                color: COLORS.blackColor,
                marginTop: 5,
                left: 27,
              }}
            >
              Mã đặt: {bookingDetails.code}
            </Text>
          </View>

          <View style={{marginVertical: 10 * 2, top: 10}}>
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
                      Tên sân: {bookingDetails.pitchName} ({bookingDetails.systemName})
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
                      Người đặt: {bookingDetails.tenant}
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
                    Giờ đá:
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
              </TouchableOpacity>

              <View>
                <Text>
                  {' '}
                  {bookingDetails.note ? bookingDetails.note : 'không có'}{' '}
                </Text>
              </View>
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
                  Đánh giá:
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <RatingInput
                  maxStars={5}
                  rating={rating}
                  setRating={setRating}
                  size={35}
                />
              </View>

              <TextInput
                style={{
                  top: 10,
                  padding: 10,
                  height: 90,
                  width: w - 30,
                  borderColor: COLORS.primaryColor,
                  borderWidth: 1,
                  backgroundColor: 'white',
                  color: COLORS.black,
                }}
                placeholder="Điền đánh giá"
                multiline={true}
                numberOfLines={4}
                borderBottomWidth={1}
                borderLeftWidth={1}
                borderRightWidth={1}
                editable={true}
                returnKeyType="done"
                onChangeText={text => {
                  setBookingNote(text);
                }}
              />
              <View style={{alignItems: 'flex-end', top: 20}}>
                <TouchableOpacity
                  style={styles.submit}
                  onPress={() => {
                    if (rating == 0 || bookingNote == '') {
                      alertMessage(
                        'Cảnh báo',
                        'Mời bạn đánh giá ít nhất 1 sao và điền nội dung',
                        'Đóng',
                      );
                    } else {
                      AddFeedBack();
                    }
                  }}
                  disabled={enableRating}
                >
                  <Text style={styles.submitText}>Đánh Giá</Text>
                </TouchableOpacity>
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
const w = Dimensions.get('window').width;
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
export default FeebackListDetail;
