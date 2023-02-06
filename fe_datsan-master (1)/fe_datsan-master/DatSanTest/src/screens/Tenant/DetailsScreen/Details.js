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
  TouchableOpacity,
  Modal,
  Animated,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/Ionicons';

import IconCom from 'react-native-vector-icons/MaterialCommunityIcons';

import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import baseStyles from '../../../constants/baseCss';
import Feather from 'react-native-vector-icons/Feather';
import BaseStyles from '../../../constants/baseCss';
import {Shapes} from 'react-native-background-shapes';
import {Rating, RatingInput} from 'react-native-stock-star-rating';
import LineargGradient from 'react-native-linear-gradient';
import Stars from 'react-native-stars';

import AuthContext from '../../../context/AuthContext';

const {width} = Dimensions.get('screen');
const {height} = Dimensions.get('screen');

const DetailsScreen = ({navigation, route}) => {
  const [pitchSystemsDetail, setPitchSystemsDetail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [pitchDetail, setPitchDetail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const detailsPitch = 'DetailPitch';

  const {userToken, host} = useContext(AuthContext);
  const house = route.params;

  useEffect(() => {
    const unSubcribe = navigation.addListener('focus', () => {
      getPitchesDetail();
      console.log(pitchSystemsDetail);
    });
    return unSubcribe;
  });
  const getPitchesDetail = () => {
    fetch(
      `${host}/api/pitch/system/detail/${house.iD}?${
        house.startDate ? 'date=' + house.startDate + '&' : null
      }${house.startTime ? 'start=' + house.startTime + '&' : null}${
        house.endTime ? 'end=' + house.endTime + '&' : null
      }`,
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
        var pitch = resJson.pitchSystem.pitches;
        if (pitch === null) {
          setPitchSystemsDetail(resJson.pitchSystem);
          setFeedback(resJson.pitchSystem.ratings);
          setPitchDetail(resJson.pitchSystem.pitches);
        } else {
          pitch.forEach(element => {
            element.systemID = resJson.pitchSystem.id;
            element.systemImg = resJson.pitchSystem.img;
            element.systemPrice = resJson.pitchSystem.price;
            element.systemHireStart = resJson.pitchSystem.hiredStart;
            element.systemHireEnd = resJson.pitchSystem.hiredEnd;
            element.services = resJson.pitchSystem.description;
            element.phone = resJson.pitchSystem.ownerPhone;
          });
        }

        setPitchSystemsDetail(resJson.pitchSystem);
        setFeedback(resJson.pitchSystem.ratings);
        setPitchDetail(resJson.pitchSystem.pitches);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const renderItem = ({item, index}) => {
    return (
      <Pressable
        style={{}}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate(detailsPitch, item);
        }}
      >
        <View style={[style.card]}>
          <Image source={{uri: item.image}} style={style.cardImage} />
          <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 0,
              }}
            >
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                Sân con: {item.name}
              </Text>
            </View>

            <View style={{marginLeft: 2, flexDirection: 'row'}}>
              <View style={style.facility}>
                <Icon name="grass" size={18} />
                <Text style={style.facilityText}>{item.grass}</Text>
              </View>
              <View
                style={[
                  style.facility,
                  {
                    justifyContent: 'space-between',
                  },
                ]}
              >
                <IconCom name="soccer-field" size={18} />
                <Text>Loại sân: {item.type} người</Text>
              </View>
            </View>
            <View style={[style.facility]}>
              <Icons name="pricetags-sharp" size={18} />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.blue,
                  fontSize: 16,
                  left: 5,
                }}
              >
                Giá tiền:{' '}
                {item.price === 'null - null'
                  ? 'Liên hệ chủ sân'
                  : Number(item.price.split(' - ')[0]).toLocaleString('vi', {
                      style: 'currency',
                      currency: 'VND',
                    })}{' '}
                {item.price === 'null - null' ? '' : '-'}{' '}
                {item.price === 'null - null'
                  ? ''
                  : Number(item.price.split(' - ')[1]).toLocaleString('vi', {
                      style: 'currency',
                      currency: 'VND',
                    })}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };
  const FeedBack = ({item, index}) => {
    return (
      <View style={style.container1}>
        <View style={style.header1}>
          <Image style={style.avatar} source={require('./fb-pitch1.jpg')} />

          <View style={style.userBox}>
            <Text style={style.user}>{item.user}</Text>
            <Text style={style.date}>
              {item.createdAt
                .split(':')[0]
                .split('-')[2]
                .split('T')[0] +
                '/' +
                item.createdAt.split('-')[1] +
                '/' +
                item.createdAt.split('-')[0]}
            </Text>
          </View>

          <View style={{flexDirection: 'column'}}>
            {item.enableEditing === true && (
              <IconCom
                style={{left: 40}}
                onPress={() =>
                  navigation.navigate('FeedBackEditor', {
                    id: item.id,
                    user: item.user,
                    rate: item.rate,
                    content: item.content,
                  })
                }
                name="square-edit-outline"
                size={18}
              />
            )}
            <Rating maxStars={5} size={13} stars={item.rate} />
          </View>
        </View>
        <Text style={{bottom: 12}}>{item.content}</Text>
      </View>
    );
  };
  const FeedBackMore = ({item, index}) => {
    return (
      <View style={[style.containerD]}>
        <View style={[style.header1D]}>
          <Image style={style.avatarD} source={require('./fb-pitch1.jpg')} />
          <View style={style.userBoxD}>
            <Text style={style.userD}>{item.user}</Text>
            <Text style={style.dateD}>
              {item.createdAt
                .split(':')[0]
                .split('-')[2]
                .split('T')[0] +
                '/' +
                item.createdAt.split('-')[1] +
                '/' +
                item.createdAt.split('-')[0]}
            </Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            {item.enableEditing === true && (
              <IconCom
                style={{left: 55}}
                onPress={() => {
                  setShowModal(false);
                  navigation.navigate('FeedBackEditor', {
                    id: item.id,
                    user: item.user,
                    rate: item.rate,
                    content: item.content,
                    showModal,
                  });
                }}
                name="square-edit-outline"
                size={18}
              />
            )}
            <Rating maxStars={5} size={18} stars={item.rate} />
          </View>
        </View>
        <Text style={{paddingLeft: 5, bottom: 5}}>{item.content}</Text>
      </View>
    );
  };
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
    <SafeAreaView style={[BaseStyles.rootDetail, {flex: 1}]}>
      <ScrollView
        style={{flex: 1, backgroundColor: 'white'}}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            baseStyles.left,
            baseStyles.row,
            baseStyles.centerVertically,
            {
              backgroundColor: COLORS.primaryColor,
              borderRadius: 10,
              height: 150,
            },
          ]}
        >
          <Image
            source={require('../../../assets/images/fb-pitch1.jpg')}
            style={{
              width: 80,
              height: 80,
              borderRadius: 50,
              marginLeft: 10,
            }}
          />
          <View style={[baseStyles.ml10]}>
            <Text
              style={[
                baseStyles.fontSize18,
                baseStyles.textBold,
                {color: COLORS.white},
              ]}
            >
              Hệ thống: {pitchSystemsDetail.name}
            </Text>
            <Text style={{color: COLORS.white, width: 250}}>
              {pitchSystemsDetail.addressDetail}, {pitchSystemsDetail.ward},{' '}
              {pitchSystemsDetail.district}, {pitchSystemsDetail.city}
            </Text>

            <Text style={{color: COLORS.white}}>
              Số điện thoại: {pitchSystemsDetail.ownerPhone}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: COLORS.white}}>
                Giờ hoạt động: {pitchSystemsDetail.hiredStart} -{' '}
                {pitchSystemsDetail.hiredEnd}{' '}
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text style={{color: COLORS.white}}>
                Giá tiền:{' '}
                {pitchSystemsDetail.price === 'null - null'
                  ? 'Liên hệ chủ sân'
                  : pitchSystemsDetail.price &&
                    Number(
                      pitchSystemsDetail.price.split('-')[0].trim(),
                    ).toLocaleString('vi', {
                      style: 'currency',
                      currency: 'VND',
                    })}{' '}
                {pitchSystemsDetail.price === 'null - null' ? '' : '-'}{' '}
                {pitchSystemsDetail.price === 'null - null'
                  ? ''
                  : pitchSystemsDetail.price &&
                    Number(
                      pitchSystemsDetail.price.split('-')[1].trim(),
                    ).toLocaleString('vi', {
                      style: 'currency',
                      currency: 'VND',
                    })}{' '}
              </Text>
            </View>
          </View>
        </View>
        <View style={{paddingLeft: 20, paddingRight: 20, flex: 1}}>
          <View style={{marginTop: 15}}>
            <Text
              style={{
                marginLeft: 5,
                fontWeight: 'bold',
                fontSize: 20,
                color: 'black',
              }}
            >
              Các sân của hệ thống
            </Text>
            <View style={style.underline}></View>
            {pitchDetail === null ? (
              <Text
                style={{
                  marginLeft: 5,
                  flex: 1,
                  paddingBottom: 20,
                  paddingTop: 7,
                }}
              >
                Hệ thống chưa có sân con
              </Text>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={pitchDetail}
                keyExtractor={item => item.id}
                renderItem={renderItem}
              />
            )}
          </View>

          <View style={{marginTop: width - 350, flex: 1, bottom: width - 345}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginLeft: 5,
                  fontWeight: 'bold',
                  fontSize: 17,
                  color: 'black',
                }}
              >
                Đánh giá (
                <Stars
                  disabled={true}
                  default={pitchSystemsDetail.rate}
                  count={5}
                  half={true}
                  fullStar={
                    <Icon
                      name={'star-rate'}
                      style={[style.myStarStyle]}
                      size={16}
                    />
                  }
                  emptyStar={
                    <Icon
                      name={'star-outline'}
                      style={[style.myStarStyle, style.myEmptyStarStyle]}
                      size={16}
                    />
                  }
                  halfStar={
                    <Icon
                      name={'star-half'}
                      style={[style.myStarStyle]}
                      size={16}
                    />
                  }
                />
                )
              </Text>
              <TouchableOpacity
                style={[
                  style.facility,
                  {
                    marginLeft: width - 300,
                  },
                ]}
                onPress={() => {
                  if (feedback === null) {
                    alertMessage(
                      'Thông báo',
                      'Hệ thống chưa có đánh giá',
                      'Đóng',
                    );
                  } else {
                    setShowModal(true);
                  }
                }}
              >
                <Text style={style.facilityText}>Xem tất cả</Text>
                <Icon name="arrow-forward-ios" size={18} />
              </TouchableOpacity>
              <Modal
                animationType={'slide'}
                transparent={false}
                visible={showModal}
                onRequestClose={() => {}}
              >
                <SafeAreaView style={{flex: 1}}>
                  <View
                    style={[
                      baseStyles.left,
                      baseStyles.row,
                      baseStyles.centerVertically,
                      {
                        backgroundColor: COLORS.primaryColor,
                        height: 100,
                        width: 500,
                        paddingLeft: 15,
                      },
                    ]}
                  >
                    <Image
                      source={require('../../../assets/images/fb-pitch1.jpg')}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 50,
                      }}
                    />
                    <View style={[baseStyles.ml10]}>
                      <Text
                        style={[
                          baseStyles.fontSize18,
                          baseStyles.textBold,
                          {color: COLORS.white},
                        ]}
                      >
                        Hệ thống: {pitchSystemsDetail.name}
                      </Text>
                      <Text style={{color: COLORS.white}}>
                        Chủ sân: {pitchSystemsDetail.owner}
                      </Text>
                      <Text style={{color: COLORS.white}}>
                        Số điện thoại: {pitchSystemsDetail.ownerPhone}
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{color: COLORS.white}}>
                          Đánh giá sân:{' '}
                        </Text>

                        <Stars
                          default={pitchSystemsDetail.rate}
                          count={5}
                          half={true}
                          fullStar={
                            <Icon
                              name={'star-rate'}
                              style={[style.myStarStyle]}
                              size={16}
                            />
                          }
                          emptyStar={
                            <Icon
                              name={'star-outline'}
                              style={[
                                style.myStarStyle,
                                style.myEmptyStarStyle,
                              ]}
                              size={16}
                            />
                          }
                          halfStar={
                            <Icon
                              name={'star-half'}
                              style={[style.myStarStyle]}
                              size={16}
                            />
                          }
                        />
                        <Text style={{color: COLORS.white}}>
                          {pitchSystemsDetail.rate}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'stretch',
                      justifyContent: 'space-between',
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        left: 30,
                        bottom: 120,
                        width: 240,
                        borderRadius: 10,
                        top: 5,
                        backgroundColor: COLORS.primaryColor,
                        marginBottom: 10,
                        borderColor: COLORS.whiteColor,
                      }}
                    >
                      <View style={[style.facility, {margin: 4}]}>
                        <Text>Đánh giá : {pitchSystemsDetail.name} </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(false);
                      }}
                      style={{
                        borderWidth: 1,
                        right: 20,
                        bottom: 120,
                        width: 60,
                        borderRadius: 10,
                        top: 5,
                        backgroundColor: COLORS.primaryColor,
                        marginBottom: 10,
                        borderColor: COLORS.whiteColor,
                      }}
                    >
                      <View style={[style.facility, {margin: 4}]}>
                        <Text>Đóng</Text>
                        <Icon name="close" size={20} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginLeft: 25, flex: 1}}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      horizontal={false}
                      data={feedback}
                      keyExtractor={item => item.id}
                      renderItem={FeedBackMore}
                    />
                  </View>
                </SafeAreaView>
              </Modal>
            </View>

            <View style={style.underline}></View>
          </View>
          <View style={{flex: 1, bottom: width - 350}}>
            {feedback ? (
              <FlatList
                horizontal={false}
                data={feedback}
                keyExtractor={item => item.id}
                renderItem={FeedBack}
              />
            ) : (
              <Text style={{marginLeft: 5, flex: 1}}>Không có đánh giá</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  settingContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 300,
    padding: 15,
    minHeight: 100,
    backgroundColor: 'white',
    zIndex: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  myStarStyle: {
    color: 'yellow',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: 'white',
  },
  cover: {backgroundColor: COLORS.overlayColor, zIndex: 9},

  lineargGradient: {
    height: 100,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  line: {
    position: 'absolute',
    width: width,
    top: 100,
    left: -300,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [
      {
        rotate: '-35deg',
      },
    ],
    borderRadius: 60,
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  container: {
    height: 60,
    backgroundColor: COLORS.white,
    marginRight: 20,
    marginLeft: 5,
    width: width - 50,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    paddingHorizontal: 5,
    marginVertical: 10,
    borderRadius: 10,
  },
  container1: {
    height: 90,
    backgroundColor: COLORS.white,
    marginRight: 20,
    marginLeft: 5,
    width: width - 50,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    paddingHorizontal: 5,
    marginVertical: 10,
    borderRadius: 10,
  },

  containerD: {
    height: 100,
    backgroundColor: COLORS.white,
    marginRight: 20,
    marginLeft: 5,
    width: width - 50,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    paddingHorizontal: 5,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: COLORS.white,
    elevation: 10,
  },
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
    borderRadius: 20,
    marginRight: 2,
  },
  userBox: {
    flex: 1,
    marginRight: 2,
  },
  user: {
    color: COLORS.blackColor,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  underline: {
    width: 50,
    height: 3,
    backgroundColor: COLORS.primaryColor,
    marginTop: 1,
    marginLeft: 5,
  },
  date: {
    fontSize: 10,
    color: 'gray',
  },
  text: {
    color: 'gray',
  },
  btn: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },

  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  borderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    width: '40%',
    borderBottomWidth: 0.25,
    borderBottomColor: COLORS.lightGrayColor,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  iconContainer: {
    position: 'absolute',
    height: 50,
    width: 260,
    backgroundColor: COLORS.primaryColor,
    top: 120,
    right: 90,
    left: 40,
    borderRadius: 30,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortBtn: {
    backgroundColor: COLORS.dark,
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  optionsCard: {
    height: 210,
    width: width / 2 - 30,
    elevation: 15,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  optionsCardImage: {
    height: 140,
    borderRadius: 10,
    width: '100%',
  },
  optionListsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionYardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  categoryListText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: COLORS.grey,
  },
  activeCategoryListText: {
    color: COLORS.dark,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  categoryListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  ListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    height: 220,
    backgroundColor: COLORS.white,
    marginRight: 20,
    borderWidth: 1,
    marginLeft: 5,
    width: width - 50,
    borderRadius: 20,
    marginTop: 30,
    bottom: 20,
    padding: 10,
    elevation: 10,
    borderColor: 'lightgray',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  facility: {flexDirection: 'row', marginRight: 15, marginTop: 5},
  facilityText: {marginLeft: 5, color: COLORS.grey},

  header1D: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    paddingTop: 5,
    bottom: 12,
    paddingLeft: 5,
  },
  avatarD: {
    height: 30,
    width: 30,
    resizeMode: 'cover',
    borderRadius: 20,
    marginRight: 2,
  },
  userBoxD: {
    flex: 1,
    marginRight: 2,
  },
  userD: {
    color: COLORS.blackColor,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  underlineD: {
    width: 50,
    height: 3,
    backgroundColor: COLORS.primaryColor,
    marginTop: 1,
    marginLeft: 5,
  },
  dateD: {
    fontSize: 10,
    color: 'gray',
  },
  textD: {
    color: 'gray',
  },
});

export default DetailsScreen;
