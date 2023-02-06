import React, {useState, useContext, useEffect, useRef} from 'react';
import {app_logo} from '../../../constants/images';
import {COLORS} from '../../../constants';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
// import CheckBox from '@react-native-community/checkbox';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {View, Text, Image, useWindowDimensions, ScrollView} from 'react-native';
import AuthContext from '../../../context/AuthContext';
import Feather from 'react-native-vector-icons/Feather';

import {Formik} from 'formik';
import * as Yup from 'yup';

const SignInSchema = Yup.object().shape({
  phone: Yup.string()
    .required('Vui lòng nhập số điện thoại')
    .nullable('Vui lòng nhập số điện thoại')
    .min(10, 'Số điện thoại có 10 chữ số!')
    .max(10, 'Số điện thoại có 10 chữ số!')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ!')
    .required('Vui lòng nhập số điện thoại'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .nullable('Vui lòng nhập mật khẩu'),
});

const SignIn = ({navigation}) => {
  const {
    signIn,
    phone,
    password,
    isLoading,
    isRememberMe,
    setIsRememberMe,
  } = useContext(AuthContext);

  const [isSecureEntry, setIsSecureEntry] = useState(true);

  const onSignInPressed = (phoneInput, passwordInput) => {
    if (phoneInput !== '' && passwordInput !== '') {
      signIn(phoneInput, passwordInput);
    }
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPressed = () => {
    navigation.navigate('SignUp');
  };

  const onShowPasswordPressed = () => {
    setIsSecureEntry(prev => !prev);
  };

  const {height} = useWindowDimensions();

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[baseStyles.root, {position: 'relative'}]}>
        <Image
          source={app_logo}
          style={[styles.logo, {height: height * 0.3}]}
          resizeMode="contain"
        />

        <Formik
          initialValues={{
            phone: phone,
            password: password,
          }}
          validationSchema={SignInSchema}
          onSubmit={(values, actions) => {
            onSignInPressed(values.phone, values.password);
            if (!isSecureEntry) {
              setIsSecureEntry(true);
            }
            /* actions.resetForm({
              values: {
                password: isRememberMe ? password : '',
              },
            }); */
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
              <CustomInput
                placeholder="Số điện thoại"
                value={values.phone}
                setValue={handleChange('phone')}
                keyboardType="number-pad"
                onBlur={() => setFieldTouched('phone')}
              />
              {touched.phone && errors.phone && (
                <Text style={{color: COLORS.dangerColor}}>{errors.phone}</Text>
              )}
              <View style={baseStyles.row}>
                <CustomInput
                  placeholder="Mật khẩu"
                  value={values.password}
                  setValue={handleChange('password')}
                  secureTextEntry={isSecureEntry}
                  onBlur={() => setFieldTouched('password')}
                />
                <Feather
                  style={styles.icon}
                  onPress={onShowPasswordPressed}
                  name={isSecureEntry ? 'eye' : 'eye-off'}
                />
              </View>
              {touched.password && errors.password && (
                <Text style={{color: COLORS.dangerColor}}>
                  {errors.password}
                </Text>
              )}
              <View style={[baseStyles.left, baseStyles.row]}>
                <BouncyCheckbox
                  size={22}
                  style={{marginVertical: 6}}
                  isChecked={isRememberMe}
                  iconStyle={{borderColor: COLORS.primaryColor}}
                  fillColor={COLORS.primaryColor}
                  onPress={() => setIsRememberMe(!isRememberMe)}
                  bounceEffectIn={1.2}
                />
                <Text style={baseStyles.pt6}>Nhớ mật khẩu</Text>
              </View>

              <CustomButton
                text="Đăng nhập"
                onPress={handleSubmit}
                type={isValid ? 'PRIMARY' : 'DISABLED'}
                disabled={!isValid}
                isLoading={isLoading}
              />
            </View>
          )}
        </Formik>
        <CustomButton
          text="Quên mật khẩu?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <View style={styles.bottom}>
          <Text>Bạn chưa có tài khoản? </Text>
          <CustomButton
            text="Đăng ký ngay"
            onPress={onSignUpPressed}
            type="TERTIARY"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
