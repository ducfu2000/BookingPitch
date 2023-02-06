import React, {useState, useContext} from 'react';
import {COLORS} from '../../../constants';
import baseStyles from '../../../constants/baseCss';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AuthContext from '../../../context/AuthContext';

import {Formik} from 'formik';
import * as Yup from 'yup';

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .nullable('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu quá ngắn!')
    .max(32, 'Mật khẩu quá dài!')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      'Mật khẩu cần có ít nhất 8 ký tự \nTối thiểu 1 chữ hoa, 1 chữ thường, 1 chữ số',
    ),
  confirmPassword: Yup.string()
    .required('Vui lòng nhập lại mật khẩu')
    .nullable('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu quá ngắn!')
    .max(32, 'Mật khẩu quá dài!')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      'Mật khẩu cần có ít nhất 8 ký tự \nTối thiểu 1 chữ hoa, 1 chữ thường, 1 chữ số',
    )
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp!'),
});
const ChangePassword = ({route, navigation}) => {
  const {phone, status} = route.params;
  const {host, userToken} = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState(null);
  const [isSecureEntryPW, setIsSecureEntryPW] = useState(true);
  const [isSecureEntryCPW, setIsSecureEntryCPW] = useState(true);
  const [isSecureEntryCPNW, setIsSecureEntryCPNW] = useState(true);
  const onShowPasswordPressed = () => {
    setIsSecureEntryPW(prev => !prev);
  };

  const onShowConfirmPasswordPressed = () => {
    setIsSecureEntryCPW(prev => !prev);
  };
  const onShowConfirmNewPasswordPressed = () => {
    setIsSecureEntryCPNW(prev => !prev);
  };

  const onChange = (oldPass, newPass) => {
    console.log('change password', oldPass, newPass);
    fetch(`${host}/api/common/password/change`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        oldPass: oldPass,
        newPass: newPass,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.message);
        if (status == 'ChangePassword' && responseJson.message == 'success') {
          Alert.alert('Đổi mật khẩu', 'Đổi mật khẩu thành công', [
            {
              text: 'Đóng',
              onPress: () => navigation.navigate('AccountInfo'),
              style: 'cancel',
            },
          ]);
        } else {
          Alert.alert('Đổi mật khẩu', responseJson.message, [
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

  const onChangeNewPass = (_phone, password) => {
    console.log('change password', _phone, password);
    fetch(`${host}/api/common/password/new`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + userToken,
      },
      body: JSON.stringify({
        phone: _phone,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.message);
        if (status == 'ForgotPassword' && responseJson.message == 'success') {
          Alert.alert('Đổi mật khẩu', 'Cập nhật mật khẩu mới thành công', [
            {
              text: 'Đóng',
              onPress: () => navigation.navigate('SignIn'),
              style: 'cancel',
            },
          ]);
        } else {
          Alert.alert('Đổi mật khẩu', responseJson.message, [
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

  return (
    <SafeAreaView style={baseStyles.root}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerText}>Đổi mật khẩu</Text>

        {status && status !== 'ForgotPassword' && (
          <View style={[baseStyles.row]}>
            <CustomInput
              placeholder="Mật khẩu cũ"
              value={oldPassword}
              setValue={setOldPassword}
              secureTextEntry={isSecureEntryPW}
            />
            <Feather
              style={styles.icon}
              onPress={onShowPasswordPressed}
              name={isSecureEntryPW ? 'eye' : 'eye-off'}
            />
          </View>
        )}
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={PasswordSchema}
          onSubmit={values => {
            if (status == 'ForgotPassword') {
              onChangeNewPass(phone, values.password);
            }
            if (status == 'ChangePassword') {
              onChange(oldPassword, values.password);
            }
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
            <View style={baseStyles.w100}>
              <View style={[styles.passwordContainer]}>
                <CustomInput
                  placeholder="Mật khẩu"
                  value={values.password}
                  setValue={handleChange('password')}
                  secureTextEntry={isSecureEntryCPW}
                  onBlur={() => setFieldTouched('password')}
                />
                <Feather
                  style={styles.icon}
                  onPress={onShowConfirmPasswordPressed}
                  name={isSecureEntryCPW ? 'eye' : 'eye-off'}
                />
              </View>
              {touched.password && errors.password && (
                <Text style={{color: COLORS.dangerColor}}>
                  {errors.password}
                </Text>
              )}
              <View style={styles.passwordContainer}>
                <CustomInput
                  placeholder="Nhập lại mật khẩu"
                  value={values.confirmPassword}
                  setValue={handleChange('confirmPassword')}
                  secureTextEntry={isSecureEntryCPNW}
                  onBlur={() => setFieldTouched('confirmPassword')}
                />
                <Feather
                  style={styles.icon}
                  onPress={onShowConfirmNewPasswordPressed}
                  name={isSecureEntryCPNW ? 'eye' : 'eye-off'}
                />
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={{color: COLORS.dangerColor}}>
                  {errors.confirmPassword}
                </Text>
              )}

              <CustomButton
                text="Cập nhật"
                onPress={handleSubmit}
                type={isValid ? 'PRIMARY' : 'DISABLED'}
                disabled={!isValid}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingVertical: 44,
  },
  passwordContainer: {
    flexDirection: 'row',
  },
  icon: {
    fontSize: 20,
    position: 'absolute',
    right: 20,
    top: 20,
    color: COLORS.grayColor,
  },
});
