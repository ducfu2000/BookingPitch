import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  Modal,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import AuthContext from '../../../context/AuthContext';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';

import {COLORS, SIZES} from '../../../constants/theme';
import DropDown from '../../../components/common/DropDown/DropDown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import BorderBottom from '../../../components/common/BorderBottom';
import MessageModal from '../../../components/common/MessageModal';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
const imagesCollection = firestore().collection('pitch_image');

const AddPitch = ({route, navigation}) => {
  const {userToken, host} = useContext(AuthContext);
  const {
    pitchId,
    action,
    timeStart,
    timeEnd,
    price,
    isWeekend,
    pitchSystemId,
  } = route.params;
  const [pitchDetail, setPitchDetail] = useState(null);
  const [pitchName, setPitchName] = useState(null);
  const [selectedPitchType, setSelectedPitchType] = useState(0);
  const [grass, setGrass] = useState(null);
  const [images, setImages] = useState([]);
  const [keys, setKeys] = useState([]);
  const [unitPrices, setUnitPrices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelectedImageIndex, setIsSelectedImageIndex] = useState(null);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (action == 'update' && !isUpdateData) {
        getPitchDetails();
        navigation.setOptions({
          title: 'Sửa thông tin sân',
        });
      }
      if (grass == null) {
        setGrass(grassType[0]);
      }
      if (selectedPitchType == 0) {
        setSelectedPitchType(pitchTypes[0]);
      }
      if (timeStart !== '' && timeEnd !== '' && price !== '') {
        console.log(timeStart, timeEnd, price, isWeekend);
        setUnitPrices(oldUnitPrices => [
          ...oldUnitPrices,
          {
            id: null,
            timeStart: timeStart,
            timeEnd: timeEnd,
            price: price,
            isWeekend: isWeekend,
          },
        ]);
      }
    });
    return unsubscribe;
  });

  const pitchTypes = [5, 7, 11];

  const grassType = ['Cỏ nhân tạo', 'Cỏ tự nhiên'];

  const pitchAdd = () => {
    fetch(`${host}/api/owner/pitch/add/${pitchSystemId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        name: pitchName,
        images: images,
        unitPrices: unitPrices,
        grass: grass,
        type: selectedPitchType,
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson.message);
        if (resJson.message == 'success') {
          Alert.alert(
            'Thêm sân',
            'Thêm sân thành công',
            [
              {
                text: 'Đóng',
                onPress: () =>
                  navigation.navigate('PitchManagementSC', {pitchSystemId}),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        } else {
          Alert.alert(
            'Thêm sân',
            resJson.message,
            [
              {
                text: 'Quay lại',
                onPress: () =>
                  navigation.navigate('PitchManagementSC', {pitchSystemId}),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const pitchUpdate = () => {
    fetch(`${host}/api/owner/pitch/update/${pitchId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        name: pitchName,
        images: images,
        unitPrices: unitPrices,
        grass: grass,
        type: selectedPitchType,
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson.message);
        if (resJson.message == 'success') {
          Alert.alert(
            'Sửa thông tin sân',
            'Sửa thông tin sân thành công',
            [
              {
                text: 'Đóng',
                onPress: () =>
                  navigation.navigate('PitchManagementSC', {pitchSystemId}),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        } else {
          Alert.alert(
            'Sửa thông tin sân',
            resJson.message,
            [
              {
                text: 'Quay lại',
                onPress: () =>
                  navigation.navigate('PitchManagementSC', {pitchSystemId}),
                style: 'cancel',
              },
            ],
            {
              cancelable: true,
            },
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getPitchDetails = () => {
    console.log(pitchSystemId, pitchId);
    if (pitchSystemId && pitchId) {
      fetch(`${host}/api/pitch/detail/${pitchSystemId}/${pitchId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
      })
        .then(res => res.json())
        .then(resJson => {
          console.log(JSON.stringify(resJson.pitch));
          if (!isUpdateData) {
            setPitchDetail(resJson.pitch);
            setPitchName(resJson.pitch.name);
            setSelectedPitchType(resJson.pitch.type);
            setGrass(resJson.pitch.grass);
            setUnitPrices(resJson.pitch.unitPrices);
            setImages(resJson.pitch.images);
          }
          setIsUpdateData(true);
        })
        .catch(e => {
          console.error(e);
        });
    }
  };

  const onPitchActionPress = () => {
    if (!pitchName || images.length == 0 || unitPrices.length == 0) {
      alertMessage(
        'Điền đầy đủ thông tin',
        'Vui lòng điền đẩy đủ thông tin!',
        'Đóng',
      );
    } else {
      action == 'add' ? pitchAdd() : action == 'update' && pitchUpdate();
    }
  };

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

  const onRemoveImage = index => {
    Alert.alert('Xóa ảnh', 'Xác nhận xóa ảnh này', [
      {text: 'Đóng', style: 'cancel'},
      {
        text: 'Xóa ảnh',
        onPress: () => {
          images.splice(index, 1);
          setRefreshFlatList(!refreshFlatlist);
        },
        style: 'ok',
      },
    ]);
  };

  // Action sheet
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

  const uploadImage = async selectedImage => {
    const reference = storage().ref(selectedImage.fileName);

    await reference.putFile(selectedImage.uri);
    downloadImage(selectedImage.fileName);
  };

  const downloadImage = async fileName => {
    const url = await storage()
      .ref(fileName)
      .getDownloadURL();
    setImages(oldImages => [...oldImages, {id: null, url: url}]);
  };

  // Action about camera and gallery
  const options = {
    mediaType: 'photo',
    saveToPhotos: true,
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

  const onOpenGallery = async () => {
    const result = await launchImageLibrary(options);
    if (result) {
      uploadImage(result.assets[0]);
    }
  };

  const Item = ({myItem, index}) => {
    return (
      <View>
        <TouchableOpacity onPress={() => onRemoveImage(index)}>
          <Image
            source={{uri: myItem.url}}
            style={[
              {width: 75, height: 50},
              baseStyles.rounded,
              baseStyles.mr5,
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const ItemUnitPrice = ({index, myItem}) => {
    return (
      <View>
        <View
          style={[baseStyles.w100, baseStyles.row, baseStyles.centerVertically]}
        >
          <View
            style={[baseStyles.row, baseStyles.centerVertically, {flex: 0.45}]}
          >
            <Text>
              {myItem.timeStart.split(':')[0] +
                ':' +
                myItem.timeStart.split(':')[1]}
              :
            </Text>
            <Feather name="arrow-right" size={15} />
            <Text>
              {myItem.timeEnd.split(':')[0] +
                ':' +
                myItem.timeEnd.split(':')[1]}
            </Text>
          </View>
          <Text style={{flex: 0.3}}>
            {Number(myItem.price).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
          <Feather
            style={{flex: 0.15}}
            name={myItem.isWeekend ? 'check-square' : 'square'}
            size={20}
          />
          <Pressable
            onPress={() => {
              unitPrices.splice(index, 1);
              setRefreshFlatList(!refreshFlatlist);
            }}
          >
            <Feather
              style={{flex: 0.15, paddingVertical: 5}}
              name={'x'}
              size={22}
            />
          </Pressable>
        </View>
        <BorderBottom />
      </View>
    );
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flex: 1}}
    >
      <SafeAreaView style={[baseStyles.root, {position: 'relative'}]}>
        <CustomInput
          label="Tên sân"
          placeholder="Nhập tên sân"
          value={pitchName}
          setValue={setPitchName}
        />
        <View style={[baseStyles.row]}>
          <View style={{flex: 0.7, marginRight: 10}}>
            <Text>Loại cỏ</Text>
            <DropDown
              data={grassType}
              onSelect={(selectedItem, index) => {
                setGrass(selectedItem);
              }}
              defaultValueByIndex={
                grassType && grassType.findIndex(e => e == grass)
              }
            />
          </View>
          <View style={{flex: 0.3, justifyContent: 'flex-end'}}>
            <Text>Kiểu sân</Text>
            <DropDown
              data={pitchTypes}
              onSelect={(selectedItem, index) => {
                setSelectedPitchType(selectedItem);
              }}
              defaultButtonText={'Chọn kiểu sân'}
              defaultValueByIndex={
                pitchTypes &&
                pitchTypes.findIndex(e => e == Number(selectedPitchType))
              }
            />
          </View>
        </View>
        <View
          style={[
            baseStyles.w100,
            baseStyles.row,
            baseStyles.spaceBetween,
            baseStyles.centerVertically,
          ]}
        >
          <FlatList
            style={[images && images.length !== 0 && baseStyles.mr10]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={images}
            renderItem={({item, index}) => <Item myItem={item} index={index} />}
            keyExtractor={item => item.url}
            extraData={refreshFlatlist}
          />
          <CustomButton
            text="Thêm ảnh"
            onPress={showActionSheet}
            type={'PRIMARY'}
            width={images && images.length !== 0 ? '30%' : '100%'}
          />
        </View>
        <View
          style={[
            baseStyles.w100,
            baseStyles.mt10,
            baseStyles.border,
            baseStyles.rounded,
            baseStyles.p10,
            {minHeight: 180, maxHeight: 220},
          ]}
        >
          <View style={[baseStyles.row, baseStyles.w100]}>
            <Text style={{flex: 0.46}}>Khung giờ</Text>
            <Text style={{flex: 0.2}}>Giá</Text>
            <Text style={{flex: 0.2}}>Cuối tuần</Text>
          </View>
          <BorderBottom />
          {unitPrices && (
            <FlatList
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              data={unitPrices}
              renderItem={({item, index}) => (
                <ItemUnitPrice index={index} myItem={item} />
              )}
              extraData={refreshFlatlist}
            />
          )}
          <Pressable
            onPress={() =>
              navigation.navigate('AddPrice', {pitchSystemId, pitchId, action})
            }
            style={styles.addPrice}
          >
            <Ionicons name="add" size={40} />
          </Pressable>
        </View>
        <View style={styles.addBtn}>
          {action == 'add' ? (
            <CustomButton
              text="Thêm sân"
              onPress={onPitchActionPress}
              type={'PRIMARY'}
              width={'100%'}
            />
          ) : (
            <CustomButton
              text="Sửa thông tin sân"
              onPress={onPitchActionPress}
              type={'PRIMARY'}
              width={'100%'}
            />
          )}
        </View>
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
    </ScrollView>
  );
};

export default AddPitch;
