import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ImageBackground,
} from 'react-native';
import {Rating, RatingInput} from 'react-native-stock-star-rating';
import AuthContext from '../../../context/AuthContext';
import moment from 'moment';
import CustomButton from '../../../components/common/CustomButton';
import baseStyles from '../../../constants/baseCss';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../../constants';
const FeedbackEditor = ({navigation, route}) => {
  const [rating, setRating] = React.useState(0);
  const {userToken, host} = useContext(AuthContext);
  const dft = route.params;
  const [bookingDetails, setBookingDetails] = useState('');
  const [bookingNote, setBookingNote] = useState('');
  const [enableRating, setEnableRating] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const detailsName = 'PitchDetails';

  const EditFeedBack = () => {
    fetch(`${host}/api/tenant/rating/update/${dft.id}`, {
      method: 'PUT',
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
        alertMessage('Thông báo', 'Bạn đã sửa đánh giá thành công', 'Đóng');
        navigation.goBack();
      })
      .catch(error => {
        console.error(error);
      });
  };
  const DeleteFeedBack = () => {
    fetch(`${host}/api/tenant/rating/delete/${dft.id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        alertMessage('Thông báo', 'Bạn đã xoá đánh giá thành công', 'Đóng');
        navigation.goBack();
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    //   BookingDetail();
    console.log(dft);
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
    <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1, backgroundColor: 'white'}}
        scrollEnabled={true}
      >
        <ImageBackground
          source={require('../../../assets/images/fb-pitch1.jpg')}
          style={{width: '100%', height: 300}}
        ></ImageBackground>
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 10 * 2,
            borderRadius: 10 * 3,
            bottom: 10 * 3,
            flex: 1,
          }}
        >
          <View style={{marginVertical: 10 * 2}}>
            <View style={{flexDirection: 'row', marginBottom: 10 * 2}}>
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
                bottom: 10 * 4,
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
                    name="face-agent"
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
                    Tên người đánh giá:
                  </Text>
                  <Text style={{fontSize: 10 * 1.6, fontWeight: '700'}}>
                    {dft.user}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', right: 40}}>
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
                  <Material
                    name="feedback"
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
                    Sao đã đánh giá:
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Rating maxStars={5} size={13} stars={dft.rate} />
                    <Text>{dft.rate}</Text>
                  </View>

                  <Text style={{fontSize: 10 * 1.6, fontWeight: '700'}}></Text>
                </View>
              </View>
            </View>
            <View style={{bottom: 10 * 7}}>
              <TouchableOpacity
                style={{paddingVertical: 10, marginRight: 10 * 2}}
              >
                <Text
                  style={{
                    color: COLORS.black,
                    fontWeight: 'bold',
                    fontSize: 10 * 1.7,
                  }}
                >
                  Sửa đánh giá:
                </Text>
              </TouchableOpacity>
              <View style={styles.container}>
                <View style={{alignItems: 'center', bottom: 30, flex: 1}}>
                  <RatingInput
                    maxStars={5}
                    rating={rating}
                    setRating={setRating}
                    size={35}
                  />
                </View>
                <TextInput
                  style={{
                    marginTop: 2,
                    height: 90,
                    borderColor: 'gray',
                    borderWidth: 1,
                    backgroundColor: 'white',
                    color: 'black',
                    bottom: 20,
                  }}
                  placeholder={dft.content}
                  multiline={true}
                  borderBottomColor="black"
                  borderBottomWidth={1}
                  borderLeftColor="black"
                  borderLeftWidth={1}
                  borderRightColor="black"
                  borderRightWidth={1}
                  editable={true}
                  returnKeyType="done"
                  onChangeText={text => {
                    setBookingNote(text);
                  }}
                />
              </View>
              <View
                style={[
                  baseStyles.row,
                  baseStyles.centerVertically,
                  baseStyles.spaceBetween,
                  baseStyles.mh20,
                  baseStyles.mb20,
                  ,
                  {height: 60, bottom: 20},
                ]}
              >
                {/* button */}
                <CustomButton
                  text="Cập nhật"
                  onPress={() => {
                    if (rating == 0) {
                      alertMessage(
                        'Cảnh báo',
                        'Mời bạn đánh giá ít nhất 1 sao',
                        'Đóng',
                      );
                    } else {
                      Alert.alert(
                        'Sửa đánh giá',
                        'Bạn có chắc sửa lại đánh giá?',
                        [
                          {
                            text: 'Có',
                            onPress: () => {
                              EditFeedBack();
                            },
                          },
                          {
                            text: 'Không',
                          },
                        ],
                      );
                    }
                  }}
                  type="PRIMARY"
                  width="40%"
                />
                <CustomButton
                  text="Xoá"
                  type="PRIMARY"
                  onPress={() => {
                    Alert.alert('Sửa đánh giá', 'Bạn có chắc xoá đánh giá?', [
                      {
                        text: 'Có',
                        onPress: () => {
                          DeleteFeedBack();
                        },
                      },
                      {
                        text: 'Không',
                      },
                    ]);
                  }}
                  width="40%"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 10, backgroundColor: '#fff'},
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
export default FeedbackEditor;
