/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import baseStyles from '../../../constants/baseCss';
import CustomButton from '../../../components/common/CustomButton';
import CustomInput from '../../../components/common/CustomInput';
import AuthContext from '../../../context/AuthContext';
import {icons, COLORS, SIZES} from '../../../constants';
import styles from './styles';
import NotificationService from '../../../services/NotificationService';

const OBookingDetail = ({route, navigation}) => {
  const {bookingId, backScreen, status} = route.params;
  const {userToken, host} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [reason, setReason] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [tTokens, setTTokens] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalReasonVisible, setModalReasonVisible] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getBookingDetail();
      console.log(bookingId);
    });
    return unsubscribe;
  });

  const alertMessage = (title, message, cancelBtn, acceptBtn?) => {
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

  const getBookingDetail = () => {
    setIsLoading(true);
    fetch(`${host}/api/booking/detail/${bookingId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson.booking);
        if (resJson.booking) {
          setBooking(resJson.booking);
        }
        console.log(JSON.stringify(resJson));
        let _tokens = resJson.tokens ? resJson.tokens : [];
        let _tTokens = resJson.tTokens ? resJson.tTokens : [];
        setTokens(_tokens);
        setTTokens(_tTokens);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onRejectBookingPress = () => {
    Alert.alert(
      'Xác nhận hủy đơn',
      'Bạn có chắc chắn muốn hủy lịch đặt sân này?',
      [
        {
          text: 'Đóng',
          style: 'cancel',
        },
        {
          text: 'Hủy',
          onPress: () => {
            console.log(booking, 'reject');
            if (booking != null) {
              setModalReasonVisible(false);
              fetch(`${host}/api/booking/reject`, {
                method: 'PUT',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: 'Token ' + userToken,
                },
                body: JSON.stringify({
                  id: booking.id,
                  reason: reason ? reason : '',
                }),
              })
                .then(res => res.json())
                .then(resJson => {
                  console.log(tokens, tokens.length);
                  console.log(tTokens, tTokens.length);
                  let notifications = resJson.notifications;
                  console.log(notifications);
                  if (notifications) {
                    notifications.forEach(notification => {
                      console.log(notification.receiver);
                      tTokens.forEach(token => {
                        NotificationService.sendNotification(
                          token,
                          notification.title,
                          notification.body,
                        );
                      });
                      tokens.forEach(token => {
                        NotificationService.sendNotification(
                          token,
                          notification.title,
                          notification.body,
                        );
                      });
                    });
                  }
                  console.log(resJson.message);
                  if (resJson.message == 'success') {
                    Alert.alert('Xác nhận hủy sân', 'Hủy đặt sân thành công', [
                      {
                        text: 'Đóng',
                        style: 'cancel',
                      },
                      {
                        text: 'Quay lại',
                        onPress: () =>
                          navigation.navigate(backScreen, {
                            sid: booking.systemId,
                            status: status,
                          }),
                        style: 'ok',
                      },
                    ]);
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
          },
          style: 'ok',
        },
      ],
    );
  };

  const onConfirmBookingPress = () => {
    fetch(`${host}/api/manager/booking/confirm/${booking && booking.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(tokens, tokens.length);
        console.log(tTokens, tTokens.length);
        let notifications = resJson.notifications;
        if (notifications) {
          notifications.forEach(notification => {
            if (notification.receiver == 'Team') {
              tTokens.forEach(token => {
                NotificationService.sendNotification(
                  token,
                  notification.title,
                  notification.body,
                );
              });
            }
            if (notification.receiver == 'Tenant') {
              tokens.forEach(token => {
                NotificationService.sendNotification(
                  token,
                  notification.title,
                  notification.body,
                );
              });
            }
          });
        }
        if (resJson.message.toLowerCase() == 'success') {
          Alert.alert(
            'Xác nhận đặt sân',
            'Xác nhận đặt sân thành công',
            [
              {
                text: 'Đóng',
                onPress: () =>
                  navigation.navigate(backScreen, {
                    selectedDateReturn: new Date(booking.rentDate),
                  }),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        } else {
          Alert.alert(
            'Xác nhận đặt sân',
            resJson.message,
            [
              {
                text: 'Quay lại',
                onPress: () =>
                  navigation.navigate(backScreen, {
                    selectedDateReturn: new Date(booking.rentDate),
                  }),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  const date = new Date(booking && booking.rentDate).toLocaleDateString(
    'vi-VN',
  );
  // YYYY-MM-DD
  const date2 = formatDate(booking && booking.rentDate);
  const rStart = new Date(
    `${date2} ${booking && booking.rentStart}`,
  ).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const rEnd = new Date(
    `${date2} ${booking && booking.rentEnd}`,
  ).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <SafeAreaView style={[baseStyles.root, {position: 'relative'}]}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        style={baseStyles.w100}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[baseStyles.w100, baseStyles.centerVertically]}>
          <Text style={[baseStyles.fontSize20, baseStyles.textBold]}>
            Sân{' '}
            {booking && booking.pitchName + ' (HT: ' + booking.systemName + ')'}
          </Text>
        </View>

        <Text
          style={[
            baseStyles.fontSize16,
            baseStyles.left,
            baseStyles.mt10,
            baseStyles.textBold,
          ]}
        >
          Mã đặt sân: {booking && booking.code}
        </Text>
        <Text
          style={[
            baseStyles.fontSize16,
            baseStyles.left,
            baseStyles.mt10,
            baseStyles.textBold,
          ]}
        >
          Khách hàng
        </Text>
        <View
          style={[
            baseStyles.w100,
            baseStyles.centerVertically,
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.ph20,
          ]}
        >
          <Text style={[baseStyles.fontSize16]}>Tên khách đặt</Text>
          <Text style={[baseStyles.fontSize16]}>
            {booking && booking.tenant}
          </Text>
        </View>
        <View
          style={[
            baseStyles.w100,
            baseStyles.centerVertically,
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.ph20,
          ]}
        >
          <Text style={[baseStyles.fontSize16]}>Ngày tạo đơn</Text>
          <Text style={[baseStyles.fontSize16]}>
            {booking && new Date(booking.updatedAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View
          style={[
            baseStyles.w100,
            baseStyles.centerVertically,
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.ph20,
          ]}
        >
          <Text style={[baseStyles.fontSize16]}>Ngày khách đặt</Text>
          <Text style={[baseStyles.fontSize16]}>{date}</Text>
        </View>
        <View
          style={[
            baseStyles.w100,
            baseStyles.centerVertically,
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.ph20,
          ]}
        >
          <Text style={[baseStyles.fontSize16]}>Giờ khách đặt</Text>
          <Text style={[baseStyles.fontSize16]}>
            {booking && rStart + ' -> ' + rEnd}
          </Text>
        </View>

        <View
          style={[
            baseStyles.w100,
            baseStyles.centerVertically,
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.ph20,
          ]}
        >
          <Text style={[baseStyles.fontSize16]}>
            {booking && booking.status == 'Rejected' ? 'Lý do' : 'Ghi chú'}
          </Text>
          <Text style={[baseStyles.fontSize16]}>
            {booking && booking.note == ''
              ? 'Không có ghi chú'
              : booking && booking.note}
          </Text>
        </View>
        <View
          style={[
            baseStyles.w100,
            baseStyles.centerVertically,
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.ph20,
          ]}
        >
          <Text style={[baseStyles.fontSize16]}>Thành tiền</Text>
          <Text style={[baseStyles.fontSize18, baseStyles.textBold]}>
            {booking &&
              booking.totalPrice.toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
              })}
          </Text>
        </View>
        <View
          style={[
            baseStyles.w100,
            baseStyles.centerVertically,
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.ph20,
          ]}
        >
          <Text style={[baseStyles.fontSize16]}>Trạng thái</Text>
          <Text
            style={[
              baseStyles.fontSize16,
              styles.status,
              {
                backgroundColor:
                  booking && booking.status == 'Pending'
                    ? COLORS.editColor
                    : booking && booking.status == 'Confirmed'
                    ? COLORS.primaryColor
                    : booking && booking.status == 'Awaiting payment'
                    ? COLORS.editColor
                    : booking &&
                      booking.status == 'Rejected' &&
                      COLORS.dangerColor,
              },
            ]}
          >
            {booking && booking.status == 'Pending'
              ? 'Chờ duyệt'
              : booking && booking.status == 'Confirmed'
              ? 'Đã xác nhận'
              : booking && booking.status == 'Awaiting payment'
              ? 'Chờ thanh toán'
              : booking && booking.status == 'Rejected' && 'Đã hủy'}
          </Text>
        </View>
        <View
          style={[
            baseStyles.w100,
            baseStyles.mt20,
            baseStyles.p10,
            baseStyles.border,
            baseStyles.rounded,
            baseStyles.mb20,
          ]}
        >
          {booking && !booking.payment && (
            <Text style={[baseStyles.fontSize16]}>
              Hiện tại chưa có ảnh xác nhận chuyển khoản
            </Text>
          )}
          {booking && booking.payment && (
            <>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image
                  source={{uri: booking.payment}}
                  style={{
                    minWidth: 80,
                    minHeight: 140,
                    borderRadius: 5,
                  }}
                />
              </TouchableOpacity>
              <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Image
                    source={{uri: booking.payment}}
                    style={{
                      resizeMode: 'contain',
                      width: '100%',
                      height: '100%',
                      borderRadius: 5,
                    }}
                  />
                </TouchableOpacity>
              </Modal>
            </>
          )}
        </View>
        <View
          style={[
            baseStyles.w100,
            baseStyles.row,
            baseStyles.spaceBetween,
            styles.btn,
          ]}
        >
          {booking &&
          booking.status !== 'Pending' &&
          booking.status !== 'Awaiting payment' ? (
            <View style={baseStyles.w100}>
              <Text style={{color: COLORS.dangerColor}}>
                Lưu ý: các sân đã xác nhận hoặc hủy không thể xác nhận lại!
              </Text>
              <CustomButton
                text="Quay lại"
                onPress={() => {
                  navigation.navigate(backScreen, {
                    selectedDateReturn: new Date(booking.rentDate),
                  });
                }}
                type="PRIMARY"
                width={'100%'}
              />
            </View>
          ) : (
            <>
              <CustomButton
                text="Hủy đặt sân"
                onPress={() => setModalReasonVisible(true)}
                type="DANGER"
                width={'45%'}
              />
              <CustomButton
                text="Xác nhận"
                onPress={onConfirmBookingPress}
                type="PRIMARY"
                width={'45%'}
              />
            </>
          )}
        </View>
      </ScrollView>
      {modalReasonVisible && (
        <>
          <Animated.View style={styles.reason}>
            <Text style={[baseStyles.fontSize18, baseStyles.textBold]}>
              Lý do hủy?
            </Text>
            <View style={[baseStyles.w100, baseStyles.mt20, baseStyles.mb10]}>
              <CustomInput
                placeholder="Nhập lý do hủy"
                value={reason}
                setValue={setReason}
              />
            </View>
            <View
              style={[
                baseStyles.row,
                baseStyles.centerVertically,
                baseStyles.w100,
                baseStyles.spaceBetween,
              ]}
            >
              <CustomButton
                text="Đóng"
                onPress={() => setModalReasonVisible(false)}
                type="DISABLED"
                width={'45%'}
              />
              <CustomButton
                text="Hủy đặt sân"
                onPress={() => onRejectBookingPress()}
                type="DANGER"
                width={'45%'}
              />
            </View>
          </Animated.View>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.cover]}
          ></Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default OBookingDetail;
