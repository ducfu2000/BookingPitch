import {View, Text, ScrollView, Alert} from 'react-native';
import React, {useState, useContext} from 'react';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import {COLORS} from '../../../constants/theme';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import AuthContext from '../../../context/AuthContext';
import {Formik} from 'formik';
import * as Yup from 'yup';
const PhoneSchema = Yup.object().shape({
  phone: Yup.string()
    .required('Vui lòng nhập số điện thoại')
    .nullable('Vui lòng nhập số điện thoại')
    .min(10, 'Số điện thoại có 10 chữ số!')
    .max(10, 'Số điện thoại có 10 chữ số!')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ!')
    .required('Vui lòng nhập số điện thoại'),
});
const ForgotPassword = ({navigation}) => {
  const {host} = useContext(AuthContext);
  const [otpCode, setOTPCode] = useState(null);
  const [haveOTP, setHaveOTP] = useState(false);
  const [phone, setPhone] = useState(null);
  const handleVerifyPress = () => {
    console.log(`${host}/api/common/otp/confirm?otp=${otpCode}`);
    fetch(`${host}/api/common/otp/confirm?otp=${otpCode}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.message);
        if (responseJson.message == 'success') {
          navigation.navigate('ChangePassword', {
            status: 'ForgotPassword',
            phone: phone,
          });
        } else {
          Alert.alert('Sai OTP', 'OTP không đúng', [
            {
              text: 'Đóng',
              style: 'cancel',
            },
          ]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onSendRequestFP = _phoneNumber => {
    setPhone(_phoneNumber);
    console.log('send otp click ', _phoneNumber);
    fetch(`${host}/api/common/resend?phone=${_phoneNumber}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        alert(responseJson.message);
        console.log(responseJson.message);
        if (
          responseJson.message !==
          'Số điện thoại chưa được đăng ký trong hệ thống'
        ) {
          setHaveOTP(true);
        } else {
          Alert.alert(
            'Quên mật khẩu',
            'Số điện thoại chưa được đăng ký trong hệ thống',
            [{text: 'Đóng', style: 'cancel'}],
          );
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={baseStyles.root}>
        <Text style={styles.headerText}>Quên mật khẩu</Text>
        <Text style={baseStyles.textBold}>
          Chúng tôi sẽ gửi mã xác nhận đến số điện thoại của bạn. Vui lòng mở
          tin nhắn để kiểm tra mật khẩu
        </Text>

        <Formik
          initialValues={{
            phone: '',
          }}
          validationSchema={PhoneSchema}
          onSubmit={(values, actions) => {
            onSendRequestFP(values.phone);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleSubmit,
            handleChange,
            isValid,
            setFieldTouched,
          }) => (
            <View style={[baseStyles.mv20, baseStyles.w100]}>
              <CustomInput
                label={'Số điện thoại'}
                placeholder="Nhập số điện thoại"
                value={values.phone}
                setValue={handleChange('phone')}
                keyboardType="number-pad"
                onBlur={() => setFieldTouched('phone')}
              />
              {touched.phone && errors.phone && (
                <Text style={{color: COLORS.dangerColor}}>{errors.phone}</Text>
              )}

              {haveOTP && (
                <View>
                  <CustomInput
                    label={'OTP'}
                    placeholder="Nhập OTP"
                    value={otpCode}
                    setValue={setOTPCode}
                    keyboardType="number-pad"
                  />
                  <View style={[baseStyles.right, baseStyles.mv5]}>
                    <Text
                      onPress={() => onSendRequestFP(phone)}
                      style={[baseStyles.textBold]}
                    >
                      Gửi lại OTP?
                    </Text>
                  </View>
                </View>
              )}
              <CustomButton
                text={haveOTP ? 'Gửi OTP' : 'Gửi'}
                onPress={haveOTP ? handleVerifyPress : handleSubmit}
                type={isValid ? 'PRIMARY' : 'DISABLED'}
                disabled={!isValid}
              />
            </View>
          )}
        </Formik>
        <View style={[baseStyles.w100, baseStyles.mt20]}>
          <CustomButton
            text="Quay lại đăng nhập"
            onPress={() => navigation.navigate('SignIn')}
            type={'TERTIARY'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
