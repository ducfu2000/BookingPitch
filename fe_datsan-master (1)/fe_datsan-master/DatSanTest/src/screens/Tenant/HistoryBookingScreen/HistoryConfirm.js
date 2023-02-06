import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BaseStyles from '../../../constants/baseCss';

import AuthContext from '../../../context/AuthContext';
import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import baseStyles from '../../../constants/baseCss';
import moment from 'moment';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {width} = Dimensions.get('screen');
const Historydetail = 'HistoryDetail';

export default function HistoryBookingRj({navigation, route}) {
  const history = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [bookingHistory, setBookingHistory] = useState([]);
  const {host, userToken} = useContext(AuthContext);
  const HistoryAwait = _currentPage => {
    setIsLoading(true);
    fetch(
      `${host}/api/tenant/booking/history?status=Confirmed&condition=past&page=${_currentPage}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        var historyID = responseJson.bookings.id;
        setBookingHistory(responseJson.bookings);
        setIsLoading(false);
        if (!responseJson.bookings) {
          setBookingHistory(responseJson.bookings);
          setIsLoading(false);
        } else if (responseJson.bookings && bookingHistory) {
          setBookingHistory(bookingHistory.concat(responseJson.bookings));
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    const unSubcribe = navigation.addListener('focus', () => {
      HistoryAwait(currentPage);
    });
    return unSubcribe;
  }, [currentPage]);

  const renderItem = ({item, index}) => {
    return (
      <Pressable
        style={{marginVertical: 5}}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('HistoryD', item);
        }}
      >
        <View style={style.card}>
          <View
            style={{
              bottom: 40,
              left: 5,
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}
          >
            <View style={style.facility}>
              <Text
                style={[
                  style.facilityText,
                  {fontSize: 16, fontWeight: 'bold', left: 7},
                ]}
              >
                Tên sân: {item.pitch}
              </Text>
            </View>
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
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 50 / 2,
                  top: 30,
                  right: 10,
                  marginRight: 10,
                }}
              />
              <View
                style={{
                  flex: 1,
                }}
              >
                <View>
                  {/* Title and price container */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  ></View>

                  <View style={style.facility}>
                    <Icon name="today" size={18} />
                    <Text style={style.facilityText}>
                      {' '}
                      Ngày đá:{' '}
                      {item.rentDate.split('-')[2] +
                        '/' +
                        item.rentDate.split('-')[1] +
                        '/' +
                        item.rentDate.split('-')[0]}
                    </Text>
                  </View>
                  <View style={style.facility}>
                    <Icon name="today" size={18} />
                    <Text style={style.facilityText}>
                      {' '}
                      Ngày đặt:{' '}
                      {item.updatedAt.split('T')[0].split('-')[2] +
                        '/' +
                        item.updatedAt.split('T')[0].split('-')[1] +
                        '/' +
                        item.updatedAt.split('T')[0].split('-')[0]}
                    </Text>
                  </View>

                  {/* Facilities container */}
                  <View
                    style={{
                      marginTop: 2,
                      flexDirection: 'row',
                      alignContent: 'flex-end',
                    }}
                  >
                    <View style={[style.facility, {width: '100%'}]}>
                      <Icon name="pricetags-sharp" size={18} />
                      <Text
                        style={[
                          style.facilityText,
                          {fontWeight: 'bold', fontSize: 16},
                        ]}
                      >
                        Giá đặt:{' '}
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(item.price)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* House image */}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={BaseStyles.root}>
      <ScrollView>
        {isLoading ? <ActivityIndicator color="#00ff00" size="large" /> : ''}
        {bookingHistory.length !== 0 ? (
          <FlatList
            horizontal={false}
            data={bookingHistory}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        ) : (
          <Text>Không có dữ liệu</Text>
        )}
        {bookingHistory &&
        bookingHistory.length >= 9 &&
        bookingHistory.length % 9 == 0 ? (
          <View style={[{alignItems: 'center'}]}>
            <Icon name="md-filter" size={18} />
            <Text
              onPress={() => {
                setCurrentPage(currentPage + 1);
                HistoryAwait(currentPage + 1);
              }}
            >
              Tải thêm
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    height: 140,
    backgroundColor: COLORS.white,
    elevation: 10,
    marginRight: 20,
    marginLeft: 18,
    width: width - 70,
    padding: 15,
    borderRadius: 20,
    marginTop: 1,
  },
  cardImage: {
    width: '100%',
    height: 140,
    borderRadius: 15,
  },
  facility: {
    flexDirection: 'row',
    marginTop: 2,
    top: 35,
    bottom: 25,
    right: 15,
  },
  facilityText: {color: COLORS.grey},
});
