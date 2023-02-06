import React, {useState, useContext, useEffect} from 'react';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {COLORS, SIZES} from '../../../constants';

import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import AuthContext from '../../../context/AuthContext';
import CustomButton from '../../../components/common/CustomButton';

const DetailPitchScreen = ({navigation, route}) => {
  const [pitchDetailSc, setPitchDetailSc] = useState([]);
  const [pitchDetailScImg, setPitchDetailScImg] = useState([]);
  const [pitchDetailScPrice, setPitchDetailScPrice] = useState([]);
  const [selectedimg, setSelectedimg] = useState(0);

  const header = ['Khung giờ', 'Giá'];
  const Data = pitchDetailScPrice.map(gallery => [
    [
      `${gallery.timeStart.split(':')[0] +
        ':' +
        gallery.timeStart.split(':')[1]} - `,
      `${gallery.timeEnd.split(':')[0] + ':' + gallery.timeEnd.split(':')[1]}`,
      `${gallery.isWeekend == true ? ' (cuối tuần)' : ' (trong tuần)'}`,
    ],
    [
      `${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(gallery.price)} `,
    ],
  ]);
  const {userToken, host} = useContext(AuthContext);
  const detail = route.params;

  useEffect(() => {
    const unSubcribe = navigation.addListener('focus', () => {
      getPitchesDetail();
      console.log(detail.systemHireEnd);
    });
    return unSubcribe;
  });
  const getPitchesDetail = () => {
    fetch(`${host}/api/pitch/detail/${detail.systemID}/${detail.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        setPitchDetailSc(resJson.pitch);
        setPitchDetailScImg(resJson.pitch.images);
        setPitchDetailScPrice(resJson.pitch.unitPrices);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <ImageBackground
          source={{
            uri:
              pitchDetailScImg[selectedimg] &&
              pitchDetailScImg[selectedimg].url,
          }}
          style={{width: '100%', height: 300}}
        >
          <SafeAreaView>
            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: 'space-between',
                flexDirection: 'row',
                height: '100%',
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 10 * 4,
                  height: 10 * 4,
                  borderRadius: 10 * 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              ></TouchableOpacity>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  paddingBottom: 10 * 8,
                  marginTop: 20,
                }}
              >
                <View>
                  {pitchDetailScImg.map((gallery, index) => (
                    <TouchableOpacity
                      style={{
                        width: 10 * 6,
                        height: 10 * 6,
                        padding: 10 / 2,
                        backgroundColor: COLORS.white,
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                      onPress={() => {
                        setSelectedimg(index);
                      }}
                    >
                      <Image
                        key={gallery.id}
                        source={{uri: gallery.url}}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 10,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 10 * 2,
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
              }}
            >
              Tên Sân: {pitchDetailSc && pitchDetailSc.name}
            </Text>
          </View>
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
                    source={require('./fb-pitch1.jpg')}
                    style={{height: 50, width: 50, borderRadius: 50 / 2}}
                  />
                  <View style={{flex: 1, paddingLeft: 7}}>
                    <View style={[style.facility]}>
                      <Material name="support-agent" size={21} />
                      <Text
                        style={[
                          style.facilityText,
                          {
                            fontSize: SIZES.h7,
                            color: COLORS.blackColor,
                          },
                        ]}
                      >
                        {pitchDetailSc.owner}
                      </Text>
                    </View>

                    <View style={[style.facility]}>
                      <Material name="phone" size={21} />
                      <Text
                        style={[
                          style.facilityText,
                          {
                            fontSize: SIZES.h7,
                            color: COLORS.blackColor,
                          },
                        ]}
                      >
                        Số điện thoại: {detail.phone}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
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
                    name="soccer-field"
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
                    Loại sân
                  </Text>
                  <Text style={{fontSize: 10 * 1.6, fontWeight: '700'}}>
                    {pitchDetailSc.type} người
                    {/* {detail.systemHireStart.split(':')[0] + ':' + detail.systemHireStart.split(':')[1]} - {detail.systemHireEnd.split(':')[0] + ':' + detail.systemHireEnd.split(':')[1]} */}
                  </Text>
                </View>
              </View>
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
                  <Material
                    name="grass"
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
                    Loại cỏ:
                  </Text>
                  <Text style={{fontSize: 10 * 1.6, fontWeight: '700'}}>
                    {pitchDetailSc.grass}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{bottom: 10 * 5}}>
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
                  Giá từng khung giờ:
                </Text>
              </TouchableOpacity>
              <View style={styles.container}>
                <Table borderStyle={{borderWidth: 1}}>
                  <Row
                    data={header}
                    flexArr={[5, 2, 1, 1]}
                    style={styles.head}
                    textStyle={styles.text}
                  />
                  <TableWrapper style={styles.wrapper}>
                    <Rows
                      data={Data}
                      flexArr={[5, 2, 1, 1]}
                      style={styles.row}
                      textStyle={styles.texts}
                    />
                  </TableWrapper>
                </Table>
              </View>
            </View>
            {detail.services && (
              <View style={{bottom: 10 * 5}}>
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
                    Dịch vụ của sân:
                  </Text>
                </TouchableOpacity>
                <Text style={{color: COLORS.dark}}>
                  {detail.services.split('\\n').map((txt, i) => (
                    <Text key={i}>
                      {txt}
                      {'\n'}
                    </Text>
                  ))}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          bottom: 10 * 2,
          width: '100%',
          backgroundColor: COLORS.lightGray,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primaryColor,
            padding: 10 * 1.5,
            marginHorizontal: 10 * 1.6,
            borderRadius: 10 * 2,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('Booking', {
              pitchDetailSc,
              open: detail.systemHireStart,
              close: detail.systemHireEnd,
            });
            console.log(detail.systemHireStart);
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 10 * 2,
              fontWeight: 'bold',
              marginRight: 10 * 7,
              marginLeft: 10 * 7,
            }}
          >
            Đặt sân
          </Text>
          <Icon name="arrow-forward" size={10 * 3} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </>
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
  cityStyle: {
    fontSize: 17,
    padding: 15,
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
