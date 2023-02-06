import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import DropDown from '../../../components/common/DropDown/DropDown';
import baseStyles from '../../../constants/baseCss';
import {COLORS, SIZES} from '../../../constants/theme';
import Feather from 'react-native-vector-icons/Feather';
import AuthContext from '../../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const RevenueManagementScreen = ({navigation}) => {
  const {host, userToken} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [revenues, setRevenues] = useState(null);
  const [pitchSystems, setPitchSystems] = useState(null);
  const [pitchSystemId, setPitchSystemId] = useState(null);
  const [pickDateType, setPickDateType] = useState(null);
  const [fromDateError, setFromDateError] = useState(null);
  const [toDateError, setToDateError] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getListPitchSystem();
    });

    return unsubscribe;
  });

  const getListPitchSystem = () => {
    fetch(`${host}/api/manager/pitch/systems`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson.pitchSystems.findIndex(e => e.id == 4));
        setPitchSystems(resJson.pitchSystems);
        setPitchSystemId(resJson.pitchSystems[0].id);
        getRevenues(resJson.pitchSystems[0].id);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getRevenues = (_pitchSystemId, _fromDate = null, _toDate = null) => {
    console.log(_pitchSystemId, _fromDate, _toDate);
    setIsLoading(true);
    fetch(
      `${host}/api/owner/revenue?sid=${_pitchSystemId}${
        _fromDate == null ? '' : '&from=' + _fromDate
      }${_toDate == null ? '' : '&to=' + _toDate}`,
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
        console.log(resJson.revenue, 'revenue');
        if (resJson.revenue) {
          setRevenues(resJson.revenue);
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formatDate = _date => {
    var dateNow = new Date(_date);
    // Get year, month, and day part from the date
    var year = dateNow.toLocaleString('default', {year: 'numeric'});
    var month = dateNow.toLocaleString('default', {month: '2-digit'});
    var day = dateNow.toLocaleString('default', {day: '2-digit'});
    // Generate yyyy-mm-dd date string
    return year + '-' + month + '-' + day;
  };

  const getDayOfWeek = day => {
    const date = new Date(day);
    switch (date.getDay()) {
      case 0:
        return 'Thứ hai';
      case 1:
        return 'Thứ ba';
      case 2:
        return 'Thứ tư';
      case 3:
        return 'Thứ năm';
      case 4:
        return 'Thứ sáu';
      case 5:
        return 'Thứ bảy';
      case 6:
        return 'Chủ nhật';
    }
  };

  const onPickDatePress = () => {
    setDatePickerVisibility(true);
  };

  const handlePickDate = selectedDate => {
    console.log(selectedDate);
    if (pickDateType == 'from') {
      console.log('From');
      if (toDate !== null) {
        console.log(
          new Date(selectedDate).getTime() > new Date(toDate).getTime(),
          new Date(selectedDate).getTime(),
          new Date(toDate).getTime(),
        );

        if (new Date(selectedDate).getTime() > new Date(toDate).getTime()) {
          setFromDateError('Ngày bắt đầu phải trước ngày kết thúc');
        } else {
          setFromDateError('');
          setFromDate(selectedDate);
        }
      } else {
        setFromDate(selectedDate);
      }
    }
    if (pickDateType == 'to') {
      if (fromDate !== null) {
        console.log(selectedDate < fromDate);
        if (new Date(selectedDate).getTime() < new Date(fromDate).getTime()) {
          setToDateError('Ngày kêt thúc phải sau ngày bắt đầu');
        } else {
          setToDateError('');
          setToDate(selectedDate);
        }
      } else {
        setToDate(selectedDate);
      }
    }
    hideDatePickerModal();
  };

  const hideDatePickerModal = () => {
    setDatePickerVisibility(false);
  };
  if (revenues) {
    revenues.sort(function(a, b) {
      return new Date(a.bookingDate) - new Date(b.bookingDate);
    });
  }
  const renderItem = ({item}) => {
    return (
      <View style={baseStyles.mt5}>
        <View style={styles.tableItem}>
          <Text
            style={[
              styles.tableItemText,
              baseStyles.fontSize16,
              baseStyles.textBold,
            ]}
          >
            {getDayOfWeek(item.bookingDate)}
          </Text>
          <Text
            style={[
              styles.tableItemText,
              baseStyles.fontSize16,
              baseStyles.textBold,
            ]}
          >
            {new Date(item.bookingDate).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.tableItem}>
          <Text style={styles.tableItemText}>{item.bookingQuantity}</Text>
        </View>
        <View style={styles.tableItem}>
          <Text style={styles.tableItemText}>{item.confirmedQuantity}</Text>
        </View>
        <View style={styles.tableItem}>
          <Text style={styles.tableItemText}>{item.rejectedQuantity}</Text>
        </View>
        <View style={styles.tableItem}>
          <Text style={[baseStyles.fontSize16, baseStyles.textBold]}>
            {Number(item.revenue).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      <View style={baseStyles.left}>
        <Text>Hệ thống</Text>
        <DropDown
          data={pitchSystems && pitchSystems}
          onSelect={(selectedItem, index) => {
            setPitchSystemId(selectedItem.id);
          }}
          label={'name'}
          selectLabel={'Chọn hệ thống'}
          width={'100%'}
          search={true}
          searchPlaceHolder="Tìm kiếm"
          searchInputStyle={{
            borderBottomWidth: 1,
            borderBottomColor: COLORS.borderColor,
          }}
          defaultValueByIndex={
            pitchSystems && pitchSystems.findIndex(e => e.id == pitchSystemId)
          }
        />
      </View>
      <View
        style={[
          baseStyles.w100,
          baseStyles.mb20,
          baseStyles.row,
          baseStyles.centerVertically,
          baseStyles.spaceBetween,
        ]}
      >
        <View style={[baseStyles.w60]}>
          <Pressable
            onPress={() => {
              setPickDateType('from');
              onPickDatePress();
            }}
            style={baseStyles.w100}
          >
            <CustomInput
              label="Ngày bắt đầu"
              placeholder="--/--/----"
              value={
                fromDate ? new Date(fromDate).toLocaleDateString('vi-VN') : ''
              }
              width={'100%'}
              editable={false}
              error={fromDateError}
            />
            <Feather name="calendar" size={25} style={styles.calendar} />
          </Pressable>
          <Pressable
            onPress={() => {
              setPickDateType('to');
              onPickDatePress();
            }}
            style={baseStyles.w100}
          >
            <CustomInput
              label="Ngày kết thúc"
              placeholder="--/--/----"
              value={toDate ? new Date(toDate).toLocaleDateString('vi-VN') : ''}
              width={'100%'}
              editable={false}
              error={toDateError}
            />
            <Feather name="calendar" size={25} style={styles.calendar} />
          </Pressable>
        </View>
        <View style={{width: '37%'}}>
          <CustomButton
            text="Xóa ngày"
            onPress={() => {
              setToDate(null);
              setFromDate(null);
              getRevenues(pitchSystemId);
            }}
            type="DANGER"
            width="100%"
            disabled={revenues == null ? true : false}
          />
          <CustomButton
            text="Kiểm tra"
            onPress={() =>
              getRevenues(
                pitchSystemId,
                new Date(fromDate).toLocaleDateString('vi-VN'),
                new Date(toDate).toLocaleDateString('vi-VN'),
              )
            }
            type="PRIMARY"
            width="100%"
            disabled={revenues == null ? true : false}
          />
        </View>
      </View>
      {revenues == null ? (
        <Text>Hiện tại hệ thống sân của bạn chưa có đơn đặt sân nào</Text>
      ) : (
        <View style={[baseStyles.w100, baseStyles.row]}>
          <View style={styles.tableLeft}>
            <Text style={[styles.tableLabel, baseStyles.mb25]}>Ngày</Text>
            <Text style={styles.tableLabel}>Tổng đơn đặt</Text>
            <Text style={styles.tableLabel}>Tổng đơn xác nhận</Text>
            <Text style={styles.tableLabel}>Tổng đơn hủy</Text>
            <Text style={styles.tableLabel}>Tổng tiền</Text>
          </View>

          <View>
            {isLoading ? (
              <ActivityIndicator
                size="large"
                style={[baseStyles.ml20, baseStyles.mt20]}
              />
            ) : (
              <FlatList
                style={styles.revenueList}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={revenues}
                renderItem={renderItem}
              />
            )}
          </View>
        </View>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handlePickDate}
        onCancel={hideDatePickerModal}
      />
    </SafeAreaView>
  );
};

export default RevenueManagementScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.whiteColor,
    padding: 10,
  },
  dropdown: {
    width: '40%',
    height: 40,
    borderRadius: 10,
  },
  calendar: {
    position: 'absolute',
    top: 35,
    right: 10,
    color: COLORS.editColor,
  },
  revenueList: {
    marginRight: 100,
  },
  tableLeft: {
    width: '25%',
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderColor,
  },
  tableLabel: {
    marginVertical: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },

  tableItem: {
    marginBottom: 25,
    marginHorizontal: 10,
    alignItems: 'center',
  },
});
