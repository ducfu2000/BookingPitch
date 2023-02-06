import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
  FlatList,
  PermissionsAndroid,
  Platform,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import ActionSheet from 'react-native-actionsheet';

import baseStyles from '../../../constants/baseCss';
import {COLORS, SIZES} from '../../../constants/theme';
import {ExpandableListView} from 'react-native-expandable-listview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Permissions from 'react-native-permissions';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AuthContext from '../../../context/AuthContext';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import NotificationService from '../../../services/NotificationService.js';

const Payment = ({route, navigation}) => {
  const {host, userToken} = useContext(AuthContext);
  const {bId, pId} = route.params;
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [banks, setBanks] = useState(null);
  const [booking, setBooking] = useState(null);
  const [managers, setManagers] = useState(null);
  const [confirmImage, setConfirmImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mTokens, setMTokens] = useState([]);
  const [tTokens, setTTokens] = useState([]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getOwnerBankingDetail();
    });

    return unsubscribe;
  });

  const getBookingDetail = _banks => {
    console.log(bId, _banks);
    if (bId) {
      fetch(`${host}/api/booking/detail/${bId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
      })
        .then(res => res.json())
        .then(resJson => {
          setBooking(resJson.booking);
          let _mTokens = resJson.mTokens ? resJson.mTokens : [];
          let _tTokens = resJson.tTokens ? resJson.tTokens : [];
          setMTokens(_mTokens);
          setTTokens(_tTokens);
          console.log(resJson.booking);
          if (resJson.booking) {
            handlePaymentPress(resJson.booking, _banks);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const getOwnerBankingDetail = () => {
    setIsLoading(true);
    fetch(`${host}/api/booking/payment/banking/all?id=${pId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(JSON.stringify(resJson));
        console.log(resJson.bankings);
        setManagers(resJson.managers);
        setBanks(resJson.bankings);
        getBookingDetail(resJson.bankings);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const checkPermission = async () => {
    if (Platform.OS == 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Yêu cầu truy cập thư viện ảnh',
            message: 'Ứng dụng yêu cầu truy cập thư viện ảnh',
          },
        );
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission Granted');
          downloadImage();
        } else {
          console.log('Storage permission not Granted');
        }
      } catch (error) {
        console.log('errro', error);
      }
    }
  };

  const actionSheet = useRef();
  const titleOptions = ['Mở máy ảnh', 'Mở thư viện ảnh', 'Đóng'];
  const valueOptions = ['openCamera', 'openGallery', 'cancel'];

  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const onActionSheetClick = index => {
    if (index !== 2) {
      valueOptions[index] == 'openCamera' ? onOpenCamera() : onOpenGallery();
    }
  };

  const onOpenCamera = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted == PermissionsAndroid.RESULTS.GRANTED) {
      const result = await launchCamera(options);
      if (result) {
        uploadImage(result.assets[0]);
      }
    }
  };

  const downloadImage = () => {
    // Main function to download the image
    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = image;
    // Getting the extention of the file
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Image Downloaded Successfully.');
      });
  };

  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };

  // upload qrcode
  const uploadImage = async (imageUrl, _booking) => {
    const reference = storage().ref('/qr_code_payment');
    if (_booking) {
      await reference
        .child(_booking.code + '.jpg')
        .putString(imageUrl.replace('data:image/png;base64,', ''), 'base64', {
          contentType: 'image/jpg',
        })
        .then(function(snapshot) {
          console.log('Uploaded a base64 string!');
        });
      downloadImageUrlFB(_booking.code + '.jpg');
    }
  };

  const downloadImageUrlFB = async fileName => {
    const url = await storage()
      .ref('/qr_code_payment')
      .child(fileName)
      .getDownloadURL();
    setImage(url);
    console.log(url);
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
  const onConfirmPaymentPress = () => {
    fetch(`${host}/api/booking/payment/add`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        code: booking.code,
        url: confirmImage,
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(tTokens, mTokens);
        let notifications = resJson.notifications;
        console.log(notifications);
        if (notifications) {
          notifications.forEach(notification => {
            /* if (notification.receiver == 'Team' && tTokens.length > 0) {
              tTokens.forEach(token => {
                NotificationService.sendNotification(
                  token,
                  notification.title,
                  notification.body,
                );
              });
            } */

            if (notification.receiver == 'Manager' && mTokens > 0) {
              mTokens.forEach(token => {
                NotificationService.sendNotification(
                  token,
                  notification.title,
                  notification.body,
                );
              });
            }
          });
        }

        console.log(resJson.message);
        if (resJson.message == 'success') {
          Alert.alert(
            'Gửi xác nhận thanh toán thành công',
            'Vui lòng chờ xác nhận từ chủ sân',
            [
              {
                text: 'Đóng',
                onPress: () => {
                  navigation.popToTop();
                },
                style: 'cancel',
              },
            ],
          );
        } else {
          Alert.alert('Thanh toán', resJson.message, [
            {
              text: 'Đóng',
              onPress: () => {
                navigation.popToTop();
              },
              style: 'cancel',
            },
          ]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const uploadPaymentImage = async selectedImage => {
    const reference = storage()
      .ref('/confirm_payment')
      .child(selectedImage.fileName);

    await reference.putFile(selectedImage.uri);
    downloadPaymentImage(selectedImage.fileName);
  };

  const downloadPaymentImage = async fileName => {
    const url = await storage()
      .ref('/confirm_payment')
      .child(fileName)
      .getDownloadURL();
    setConfirmImage(url);
  };

  const options = {
    mediaType: 'photo',
    saveToPhotos: true,
    includeBase64: true,
  };

  const onOpenGallery = async () => {
    const result = await launchImageLibrary(options);
    if (result) {
      uploadPaymentImage(result.assets[0]);
    }
  };

  const handlePaymentPress = (_booking, _banks) => {
    console.log(_booking, _banks);
    if (_booking && _banks) {
      fetch(
        'https://api.vietqr.io/v2/generate/?x-client-id=074de246-db64-4491-837b-7e912e7017f3&x-api-key=877003d6-eeaa-4002-a473-79994d4abbf2',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-client-id': '074de246-db64-4491-837b-7e912e7017f3',
            'x-api-key': '877003d6-eeaa-4002-a473-79994d4abbf2',
          },
          body: JSON.stringify({
            accountNo: _banks[0].bankingNumber,
            accountName: _banks[0].name,
            acqId: _banks[0].bin,
            addInfo: `[${_booking.code}] he thong san ${_booking.systemName}`,
            amount: _booking.totalPrice,
            format: 'text',
            template: 'qr_only',
          }),
        },
      )
        .then(res => res.json())
        .then(resJson => {
          setQrImageUrl(resJson.data.qrDataURL);
          if (resJson.data.qrDataURL) {
            uploadImage(resJson.data.qrDataURL, _booking);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const [isBankInfoOpen, setIsBankInfoOpen] = useState(true);

  const onShowBankInfo = () => {
    setIsBankInfoOpen(!isBankInfoOpen);
  };

  const Item = ({myItem}) => {
    return (
      <View
        style={[
          styles.bankInfoItem,
          baseStyles.row,
          baseStyles.centerVertically,
          baseStyles.spaceBetween,
          isBankInfoOpen ? styles.borderBottom : styles.empty,
        ]}
      >
        <Image source={{uri: myItem.logo}} style={{width: 70, height: 35}} />
        <View>
          <Text>{myItem.name}</Text>
          <Text>{myItem.bankingNumber}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[baseStyles.root]}>
      <ScrollView style={baseStyles.w100} showsVerticalScrollIndicator={false}>
        {managers && (
          <View style={[baseStyles.w100]}>
            <Text style={[baseStyles.fontSize16, baseStyles.textBold]}>
              Hiện tại chưa có phương thức thanh toán với chủ sân. Vui lòng liên
              hệ để được xác nhận.
            </Text>
            <Text
              style={[
                baseStyles.fontSize16,
                baseStyles.textBold,
                baseStyles.mt20,
              ]}
            >
              Thông tin liên hệ
            </Text>
            <FlatList
              style={[baseStyles.w100, baseStyles.mt10]}
              showsVerticalScrollIndicator={false}
              data={managers}
              renderItem={({item}) => (
                <View
                  style={[
                    baseStyles.w100,
                    baseStyles.row,
                    baseStyles.centerVertically,
                  ]}
                >
                  <Text style={[baseStyles.fontSize16]}>{item.name} - </Text>
                  <Text style={[baseStyles.fontSize16]}>{item.phone}</Text>
                </View>
              )}
            />
            <View style={[baseStyles.w100, {marginTop: 100}]}>
              <CustomButton
                text="Về trang chủ"
                onPress={() => navigation.navigate('HomeForEndUser')}
                type={'PRIMARY'}
              />
            </View>
          </View>
        )}

        {banks && (
          <View style={[baseStyles.w100, baseStyles.centerVertically]}>
            <View style={[baseStyles.w100, baseStyles.centerVertically]}>
              {qrImageUrl ? (
                <Image
                  style={[{width: 200, height: 200, position: 'relative'}]}
                  source={{
                    uri: qrImageUrl,
                  }}
                />
              ) : (
                <ActivityIndicator size="large" />
              )}
            </View>
            <View style={[baseStyles.centerVertically, baseStyles.w100]}>
              <View style={[baseStyles.row, baseStyles.centerVertically]}>
                <Image style={styles.logoBank} source={{uri: banks[0].logo}} />
                <Pressable onPress={checkPermission}>
                  <Feather name="download" size={25} />
                </Pressable>
              </View>
              <Pressable
                onPress={onShowBankInfo}
                style={[
                  styles.bankInfo,
                  baseStyles.row,
                  baseStyles.centerVertically,
                  baseStyles.spaceBetween,
                  baseStyles.mt10,
                  !isBankInfoOpen ? styles.borderBottom : styles.empty,
                ]}
              >
                <Text style={[baseStyles.textBlack]}>Thông tin ngân hàng</Text>
                <MaterialIcons
                  name={
                    isBankInfoOpen
                      ? 'keyboard-arrow-down'
                      : 'keyboard-arrow-right'
                  }
                  size={25}
                />
              </Pressable>
              <View style={[styles.bankInfoList]}>
                {isBankInfoOpen && banks && (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    style={baseStyles.w100}
                    data={banks}
                    renderItem={({item}) => <Item myItem={item} />}
                  />
                )}
              </View>
            </View>
            <Pressable onPress={onOpenGallery}>
              <View
                style={[
                  baseStyles.border,
                  baseStyles.centerHorizontal,
                  baseStyles.centerVertically,
                  styles.confirmImage,
                ]}
              >
                {confirmImage && (
                  <Image
                    source={{uri: confirmImage}}
                    style={{width: 140, height: 160, borderRadius: 5}}
                  />
                )}
                {!confirmImage && <Text style={[styles.addBtn]}>+</Text>}
              </View>
            </Pressable>
            {confirmImage && <Text>Ấn vào ảnh để thay đổi hình ảnh</Text>}
            <Text style={{color: COLORS.dangerColor, marginTop: 10}}>
              Lưu ý: tải lên ảnh thanh toán thành công để hoàn thành đặt sân!!
            </Text>
            <View style={[baseStyles.w100, baseStyles.mb20]}>
              <CustomButton
                text="Xác nhận đã thanh toán"
                onPress={onConfirmPaymentPress}
                type={'PRIMARY'}
                disabled={confirmImage ? false : true}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <ActionSheet
        ref={actionSheet}
        title={'Thêm ảnh'}
        options={titleOptions}
        cancelButtonIndex={2}
        onPress={index => {
          /* do something */
          onActionSheetClick(index);
        }}
      />
    </SafeAreaView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  empty: {},
  textHeader: {
    fontSize: 14,
    marginLeft: 10,
  },
  logoBank: {
    width: 100,
    height: 50,
    marginRight: 20,
  },

  bankInfo: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    backgroundColor: COLORS.lightGray,
    padding: 10,
    width: '80%',
  },
  bankInfoList: {
    width: '80%',
  },
  bankInfoItem: {
    backgroundColor: COLORS.lightGray,
    padding: 10,
  },

  confirmImage: {
    marginTop: 10,
    width: 140,
    height: 160,
    borderRadius: 5,
  },
  addBtn: {fontSize: 45},

  borderBottom: {
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  bankItem: {
    marginRight: 20,
    marginBottom: 10,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  bankItem2: {
    width: '47%',
  },
});
