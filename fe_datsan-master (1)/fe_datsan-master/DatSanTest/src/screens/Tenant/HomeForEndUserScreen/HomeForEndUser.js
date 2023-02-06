import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';

// import Geolocation from '@react-native-community/geolocation';
import AuthContext from '../../../context/AuthContext';

import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BaseStyles from '../../../constants/baseCss';
import Geolocation from 'react-native-geolocation-service';
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Yêu cầu truy cập vị trí',
        message: 'Chúng tôi có thể xin cấp quyền vị trí?',
        buttonNeutral: 'Nhắc lại sau',
        buttonNegative: 'Đóng',
        buttonPositive: 'Đồng ý',
      },
    );
    console.log('granted', granted);
    if (granted == 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const {width} = Dimensions.get('screen');
const HomeForEndUser = ({navigation}) => {
  const {userToken, host} = useContext(AuthContext);
  const categoryList = ['Sân gần nhất'];
  const YardL = ['Sân tốt nhất'];
  const detailsName = 'PitchDetails';
  const [data, setData] = useState('');
  const [fivePitchNearest, setFivePitchNearest] = useState([]);
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  const [isHomeLoading, setIsHomeLoading] = useState(false);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongtitude] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLocation();

      getAddressDetails();
      getNearbyLocation();
      getTop();
    });

    return unsubscribe;
  });

  const getLocation = () => {};

  const getNearbyLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          //Will give you the current location
          position => {
            //getting the Longitude from the location json
            setLongtitude(JSON.stringify(position.coords.longitude));

            //getting the Latitude from the location json
            setLatitude(JSON.stringify(position.coords.latitude));
            setIsHomeLoading(true);
            fetch(
              `${host}/api/tenant/nearest?${
                JSON.stringify(position.coords.latitude)
                  ? 'lat=' + JSON.stringify(position.coords.latitude) + '&'
                  : ''
              }${
                JSON.stringify(position.coords.longitude)
                  ? 'lng=' + JSON.stringify(position.coords.longitude) + '&'
                  : ''
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
              .then(response => response.json())
              .then(responseJson => {
                // alert(JSON.stringify(responseJson.nearest));
                setFivePitchNearest(responseJson.nearest);
                setIsHomeLoading(false);
              })
              .catch(err => {
                console.error(err);
              });

            console.log(longitude);
          },
          error => alert(error.message),
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 10000,
          },
        );
      }
    });
  };

  const getAddressDetails = async () => {
    // alert(latitude + ' ' + longitude);
    fetch(
      `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${latitude}%2C${longitude}&language=vi`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key':
            '8ee4fcd4c0msh2dca0d578d3c4bap174169jsn279b150bf1fd',
          'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
        },
        // }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        // alert(JSON.stringify(responseJson.results[0].region));
        // setCity(responseJson.results[0]['region']);
        // setDistrict(responseJson.results[0]['area']);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getTop = () => {
    setIsHomeLoading(true);
    fetch(`${host}/api/pitch/system/top`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.topPitches) {
          setData(responseJson.topPitches);

          setIsHomeLoading(false);
        }
        console.log('Home For End User');
        console.log(latitude + ',' + longitude);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const ListCategories = () => {
    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
    return (
      <View style={style.ListContainer}>
        {categoryList.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedCategoryIndex(index)}
          >
            <Text
              style={[
                style.categoryListText,
                index == selectedCategoryIndex && style.activeCategoryListText,
              ]}
            >
              {category} {isHomeLoading && <ActivityIndicator size="small" />}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const ListOptions = () => {
    const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
    return (
      <View style={style.categoryListContainer}>
        {YardL.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedCategoryIndex(index)}
          >
            <Text
              style={[
                style.categoryListText,
                index == selectedCategoryIndex && style.activeCategoryListText,
              ]}
            >
              {category} {isHomeLoading && <ActivityIndicator size="small" />}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };
  const [categories, setCategories] = React.useState([
    {
      id: 0,
      img: images.home,
    },
    {
      id: 1,
      img: images.home,
    },
    {
      id: 2,
      img: images.home,
    },
    {
      id: 3,
      img: images.home,
    },
  ]);

  // };
  const renderItem = ({item, index}) => {
    return (
      <Pressable
        style={{marginVertical: 5}}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate(detailsName, {iD: item.id});
        }}
      >
        <View style={style.card}>
          <Image
            source={
              item.image
                ? {uri: item.image}
                : require('../../../assets/images/pitch.png')
            }
            style={style.cardImage}
          />
          <View style={{marginTop: 3}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {item.name}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.blue,
                  fontSize: 14,
                  paddingTop: 3,
                }}
              >
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

            <Text style={{color: COLORS.grey, fontSize: 14, marginTop: 5}}>
              {item.addressDetail}, {item.ward}, {item.district}, {item.city}
            </Text>

            <View style={{marginTop: 10, flexDirection: 'row'}}>
              <View style={style.facility}>
                <Icon name="restaurant" size={18} />
                <Text style={style.facilityText}>đồ ăn</Text>
              </View>
              <View style={style.facility}>
                <Icon name="local-drink" size={18} />
                <Text style={style.facilityText}>trà đá</Text>
              </View>
              <View style={style.facility}>
                <Icon name="aspect-ratio" size={18} />
                <Text style={style.facilityText}>{item.distance}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };
  const renderItemHome = ({item, index}) => {
    return (
      <Pressable
        style={{marginVertical: 5}}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate(detailsName, {iD: item.id});
          console.log(item.id);
        }}
      >
        <View style={style.cardHome}>
          <Image
            source={
              item.image
                ? {uri: item.image}
                : require('../../../assets/images/pitch.png')
            }
            style={style.cardImageHome}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
                {item.name}
              </Text>
            </View>

            <Text style={{color: COLORS.grey, fontSize: 14, marginTop: 2}}>
              {item.district}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <View style={BaseStyles.root}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={{flex: 1}}>
          <FlatList
            nestedScrollEnabled={true}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => {
              return (
                <View>
                  <Image
                    style={{
                      height: 120,
                      width: 300,

                      overflow: 'hidden',
                      marginHorizontal: 5,
                      borderRadius: 10,
                    }}
                    resizeMode="cover"
                    source={item.img}
                  ></Image>
                </View>
              );
            }}
          />
        </View>

        <ListOptions />
        <FlatList
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItemHome}
        />

        <ListCategories />
        <FlatList
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          data={fivePitchNearest ? fivePitchNearest : data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      </ScrollView>
    </View>
  );
};

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
    backgroundColor: COLORS.white,
    elevation: 10,
    marginRight: 20,
    marginLeft: 5,
    width: width - 50,
    padding: 15,
    borderRadius: 20,
  },
  cardImage: {
    width: '100%',
    height: 140,
    borderRadius: 15,
  },
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
  cardHome: {
    height: 150,
    backgroundColor: COLORS.white,
    elevation: 10,
    marginRight: 20,
    marginLeft: 5,
    width: width - 200,
    padding: 15,
    borderRadius: 10,
  },
  cardImageHome: {
    width: '100%',
    height: 80,
    paddingLeft: -10,
    borderRadius: 10,
  },
  facilityHome: {flexDirection: 'row', marginRight: 15},
  facilityTextHome: {marginLeft: 5, color: COLORS.grey},
});
export default HomeForEndUser;
