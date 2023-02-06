import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import {COLORS} from '../../../constants/theme';
import AuthContext from '../../../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';

const VerifyAccount = ({route, navigation}) => {
  const {host} = useContext(AuthContext);

  const [isValidateCode, setIsValidateCode] = useState(null);
  const [isCodeHasExpired, setIsCodeHasExpired] = useState(false);
  const [countDownNumbers, setCountDownNumbers] = useState(60);
  const {phoneNum} = route.params;
  const onValidatePressed = () => {
    console.log(isValidateCode);
    if (isValidateCode !== '') {
      console.log(phoneNum, isValidateCode);
      handleVerifyPress(isValidateCode);
    } else {
      console.log(phoneNum, isValidateCode);
    }
  };

  const handleVerifyPress = otpInput => {
    fetch(`${host}/api/common/activate`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNum,
        otp: otpInput,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == 'ActivatedSuccess') {
          alertMessage(
            'Đăng ký tài khoản',
            responseJson.message == 'ActivatedSuccess' && 'Đăng ký thành công',
            'Đóng',
          );
          navigation.navigate('SignIn');
        } else if (responseJson.message == 'ActivatedSuccess') {
          alertMessage(
            'Sai OTP',
            responseJson.message == 'ActiveFailed' &&
              'Sai OTP, vui lòng nhập lại',
            'Đóng',
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
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
  const CountDown = () => {
    const countDown = setInterval(setCountDownNumber, 1000);
    function setCountDownNumber() {
      setCountDownNumbers(countDownNumbers - 1);
    }
    useEffect(() => {
      countDown;
      return () => clearInterval(countDown);
    });
    if (countDownNumbers == 0) {
      clearInterval(countDown);
      setIsCodeHasExpired(true);
      return <Text style={{color: COLORS.dangerColor}}>Mã hết hiệu lực</Text>;
    }
    return <Text>{countDownNumbers}s</Text>;
  };

  const onResendCodePressed = () => {
    fetch(`${host}/api/common/resend`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNum,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        alert(responseJson.message);
      })
      .catch(error => {
        console.error(error);
      });
    setCountDownNumbers(60);
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={baseStyles.root}>
        <Text style={styles.headerText}>Xác minh mã bảo mật</Text>
        <Text style={baseStyles.textBold}>
          Chúng tôi đã gửi mã code đến số điện thoại của bạn. Vui lòng mở tin
          nhắn để nhận mã bảo mật
        </Text>
        <View style={baseStyles.row}>
          <CustomInput
            placeholder="* * * * * *"
            value={isValidateCode}
            setValue={setIsValidateCode}
            keyboardType="number-pad"
          />
          <Text style={styles.textLeft}>
            <CountDown />
          </Text>
        </View>
        <View style={baseStyles.right}>
          <CustomButton
            text="Gửi lại mã xác nhận?"
            onPress={onResendCodePressed}
            type="TERTIARY"
          />
        </View>
        <CustomButton
          text="Xác minh"
          onPress={onValidatePressed}
          type={isCodeHasExpired ? 'DISABLED' : 'PRIMARY'}
          disabled={isCodeHasExpired}
        />
        <View style={[baseStyles.row, baseStyles.centerVertically]}>
          <Feather name="chevron-left" size={22} />
          <CustomButton
            text="Quay lại"
            onPress={() => navigation.navigate('SignUp')}
            type={'TERTIARY'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default VerifyAccount;
