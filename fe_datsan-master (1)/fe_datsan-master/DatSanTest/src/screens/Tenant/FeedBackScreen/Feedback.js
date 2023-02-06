import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BaseStyles from '../../../constants/baseCss';

import AuthContext from '../../../context/AuthContext';
import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import moment from 'moment';

const {width} = Dimensions.get('screen');

export default function HistoryBooking({navigation, route}) {
  const history = route.params;
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingHistory, setBookingHistory] = useState([]);
  const {host, userToken} = useContext(AuthContext);
  const HistoryAwait = _currentPage => {
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

        if (!responseJson.bookings) {
          setBookingHistory(responseJson.bookings);
        } else if (responseJson.bookings && bookingHistory) {
          setBookingHistory(bookingHistory.concat(responseJson.bookings));
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    HistoryAwait(currentPage);
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <Pressable
        style={{marginVertical: 5}}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('FeedBackListDetails', item);
          console.log(item);
        }}
      >
        <View style={style.card}>
          {/* House image */}
          <View style={style.facility}>
            <Icon name="ios-barcode" size={18} />
            <Text style={style.facilityText}>Mã đơn hàng: {item.code}</Text>
          </View>
          <View>
            {/* Title and price container */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={style.facility}>
                <Icon name="football-outline" size={18} />
                <Text
                  style={[
                    style.facilityText,
                    {fontSize: 16, fontWeight: 'bold'},
                  ]}
                >
                  Tên sân: {item.pitchName}
                </Text>
              </View>
            </View>

            <View style={style.facility}>
              <Icon name="ios-barcode" size={18} />
              <Text style={style.facilityText}>
                Hệ thống sân: {item.systemName}
              </Text>
            </View>
            <View style={style.facility}>
              <Icon name="today" size={18} />
              <Text style={style.facilityText}>
                {' '}
                Ngày đặt: {moment(item.rentDate).format('DD/MM/yyyy')}
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
              <View style={[style.facility, {width: '70%'}]}>
                <Icon name="pricetags-sharp" size={18} />
                <Text
                  style={[
                    style.facilityText,
                    {fontWeight: 'bold', fontSize: 16},
                  ]}
                >
                  Giá đặt: {item.totalPrice} VNĐ
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={BaseStyles.root}>
      {/* <Shapes
                primaryColor={COLORS.primaryColor}
                secondaryColor={COLORS.lightGreenColor}
                height={3}
                borderRadius={20}
                figures={[
                    { name: 'circle', position: 'center', size: 60 },
                    { name: 'donut', position: 'flex-start', axis: 'top', size: 80 },
                    { name: 'circle', position: 'center', axis: 'right', size: 100 },
                ]}
            />

            <View
                style={[baseStyles.left, baseStyles.row, baseStyles.centerVertically]}
            >
                <Image
                    source={require('../../../assets/images/circled-user-male-skin-type-1-2.jpg')}
                    style={{ width: 80, height: 80, borderRadius: 50 }}
                />
                <View style={[baseStyles.ml10]}>
                    <Text style={[baseStyles.fontSize18, baseStyles.textBold]}>
                        Tran Huy Vu
                    </Text>
                    <Text>Khách hàng</Text>
                </View>
            </View> */}
      <ScrollView>
        <FlatList
          horizontal={false}
          data={bookingHistory}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
        {bookingHistory.length % 9 == 0 ? (
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
    height: 150,
    backgroundColor: COLORS.white,
    elevation: 10,
    marginRight: 20,
    marginLeft: 5,
    width: width - 50,
    padding: 15,
    borderRadius: 20,
    marginTop: 1,
  },
  cardImage: {
    width: '100%',
    height: 140,
    borderRadius: 15,
  },
  facility: {flexDirection: 'row', marginRight: 15, marginTop: 2},
  facilityText: {marginLeft: 5, color: COLORS.grey},
});
