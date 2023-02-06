import {
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  SafeAreaView,
  Animated,
  StyleSheet,
} from 'react-native';
import React, {useState, useContext} from 'react';
import {COLORS} from '../../../constants';
import baseStyles from '../../../constants/baseCss';
import styles from './styles';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CustomInput from '../../../components/common/CustomInput/CustomInput';
import CustomButton from '../../../components/common/CustomButton/CustomButton';
// import CheckBox from '@react-native-community/checkbox';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Feather from 'react-native-vector-icons/Feather';
import AuthContext from '../../../context/AuthContext';

import {Formik} from 'formik';
import * as Yup from 'yup';

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .required('Vui lòng nhập tên')
    .nullable('Tên không được để trống'),
  phone: Yup.string()
    .min(10, 'Số điện thoại có 10 chữ số!')
    .max(10, 'Số điện thoại có 10 chữ số!')
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ!')
    .required('Vui lòng nhập số điện thoại')
    .nullable('Vui lòng nhập số điện thoại'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .nullable('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu quá ngắn!')
    .max(32, 'Mật khẩu quá dài!')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/,
      'Mật khẩu cần có ít nhất 8 ký tự \nTối thiểu 1 chữ hoa, 1 chữ thường, 1 chữ số',
    ),
  confirmPassword: Yup.string()
    .required('Vui lòng nhập lại mật khẩu')
    .nullable('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu quá ngắn!')
    .max(32, 'Mật khẩu quá dài!')
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/,
      'Mật khẩu cần có ít nhất 8 ký tự \nTối thiểu 1 chữ hoa, 1 chữ thường, 1 chữ số',
    )
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp!'),
});

const SignUp = ({navigation}) => {
  const {host} = useContext(AuthContext);

  const [isPitchOwnerCheckBox, setIsPitchOwnerCheckBox] = useState(false);
  const [isAcceptRuleCheckBox, setIsAcceptRuleCheckBox] = useState(false);
  const [isSecureEntryPW, setIsSecureEntryPW] = useState(true);
  const [isSecureEntryCPW, setIsSecureEntryCPW] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const handleSignUpPress = (name, phone, password) => {
    console.log(name, phone, password);
    fetch(`${host}/api/common/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        password: password,
        role: isPitchOwnerCheckBox == true ? 'OWNER' : 'TENANT',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == 'PhoneExisted') {
          Alert.alert(
            'Đăng ký tài khoản',
            'Số điện thoại này đã được đăng ký trước đó vui lòng kiểm tra lại',
            [{text: 'Đóng', style: 'cancel'}],
          );
        } else if (responseJson.message == 'RegisterSuccess') {
          navigation.navigate('Validation', {phoneNum: phone});
        } else {
          Alert.alert('Đăng ký tài khoản', responseJson.message, [
            {text: 'Đóng', style: 'cancel'},
          ]);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onSignUpPressed = (name, phone, password) => {
    if (isAcceptRuleCheckBox) {
      handleSignUpPress(name, phone, password);
    } else {
      Alert.alert('Đăng ký tài khoản', 'Bạn chưa đồng ý điều khoản sử dụng!', [
        {text: 'Đóng', style: 'cancel'},
      ]);
    }
  };

  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };

  const onShowPasswordPressed = () => {
    setIsSecureEntryPW(prev => !prev);
  };

  const onShowConfirmPasswordPressed = () => {
    setIsSecureEntryCPW(prev => !prev);
  };

  return (
    <SafeAreaView style={baseStyles.root}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.headerText}>Đăng ký với số điện thoại</Text>
          <Formik
            initialValues={{
              name: '',
              phone: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={SignUpSchema}
            onSubmit={values => {
              onSignUpPressed(values.name, values.phone, values.password);
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
                  placeholder="Tên"
                  value={values.name}
                  setValue={handleChange('name')}
                  onBlur={() => setFieldTouched('name')}
                />
                {touched.name && errors.name && (
                  <Text style={{color: COLORS.dangerColor}}>{errors.name}</Text>
                )}
                <CustomInput
                  placeholder="Số điện thoại"
                  value={values.phone}
                  setValue={handleChange('phone')}
                  keyboardType="number-pad"
                  onBlur={() => setFieldTouched('phone')}
                />
                {touched.phone && errors.phone && (
                  <Text style={{color: COLORS.dangerColor}}>
                    {errors.phone}
                  </Text>
                )}
                <View style={styles.passwordContainer}>
                  <CustomInput
                    placeholder="Mật khẩu"
                    value={values.password}
                    setValue={handleChange('password')}
                    secureTextEntry={isSecureEntryPW}
                    onBlur={() => setFieldTouched('password')}
                  />
                  <Feather
                    style={styles.icon}
                    onPress={onShowPasswordPressed}
                    name={isSecureEntryPW ? 'eye' : 'eye-off'}
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
                    secureTextEntry={isSecureEntryCPW}
                    onBlur={() => setFieldTouched('confirmPassword')}
                  />
                  <Feather
                    style={styles.icon}
                    onPress={onShowConfirmPasswordPressed}
                    name={isSecureEntryCPW ? 'eye' : 'eye-off'}
                  />
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={{color: COLORS.dangerColor}}>
                    {errors.confirmPassword}
                  </Text>
                )}

                <CustomButton
                  text="Đăng ký"
                  onPress={handleSubmit}
                  type={isValid ? 'PRIMARY' : 'DISABLED'}
                  disabled={!isValid}
                />
                <View style={[baseStyles.left, baseStyles.row]}>
                  <BouncyCheckbox
                    size={22}
                    style={{marginVertical: 6}}
                    isChecked={isPitchOwnerCheckBox}
                    iconStyle={{borderColor: COLORS.primaryColor}}
                    fillColor={COLORS.primaryColor}
                    onPress={() =>
                      setIsPitchOwnerCheckBox(!isPitchOwnerCheckBox)
                    }
                    bounceEffectIn={1.2}
                  />
                  <Text style={baseStyles.pt6}>Đăng ký với chủ sân</Text>
                </View>
                <View style={[baseStyles.row, baseStyles.left]}>
                  <BouncyCheckbox
                    size={22}
                    style={{marginVertical: 6}}
                    isChecked={isAcceptRuleCheckBox}
                    iconStyle={{borderColor: COLORS.primaryColor}}
                    fillColor={COLORS.primaryColor}
                    onPress={() =>
                      setIsAcceptRuleCheckBox(!isAcceptRuleCheckBox)
                    }
                    bounceEffectIn={1.2}
                  />
                  <Text
                    onPress={() => setModalVisible(true)}
                    style={[styles.textRule, baseStyles.pt6]}
                  >
                    Đồng ý với chúng tôi các{' '}
                    <Text style={[baseStyles.textBold, baseStyles.textItalic]}>
                      Điều khoản dịch vụ{' '}
                    </Text>
                    và{' '}
                    <Text style={[baseStyles.textBold, baseStyles.textItalic]}>
                      Chính sách về quyền riêng tư.
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          </Formik>
          <View style={styles.bottom}>
            <Text>Bạn đã có tài khoản? </Text>
            <CustomButton
              text="Đăng nhập"
              onPress={onSignInPressed}
              type="TERTIARY"
            />
          </View>
        </View>
      </ScrollView>
      {modalVisible && (
        <>
          <Animated.View style={styles.rulesContainer}>
            <Text style={[baseStyles.textBold, baseStyles.fontSize20]}>
              Điều khoản dịch vụ
            </Text>
            <Pressable
              style={styles.btnClose}
              onPress={() => setModalVisible(false)}
            >
              <Feather name="x" size={25} />
            </Pressable>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  baseStyles.textBold,
                  baseStyles.fontSize18,
                  baseStyles.mt10,
                ]}
              >
                Người thuê
              </Text>
              <Text style={[baseStyles.fontSize16, baseStyles.mv5]}>
                + Thanh toán trước tiền sân cho chủ sân
              </Text>
              <Text style={[baseStyles.fontSize16, baseStyles.mv5]}>
                + Thanh toán xong mà chủ sân có trước lịch book thì yêu cầu
                người dùng report cho Admin để có thể có phương án xử lý và hoàn
                tiền hoặc đến trực tiếp sân để xử lý với chủ sân.
              </Text>
              <Text style={[baseStyles.fontSize16, baseStyles.mv5]}>
                + Nếu đã thanh toán và người dùng chủ động hủy sân do có sự cố
                thì người dùng có thể report cho Admin hoặc liên hệ trực tiếp
                với chủ sân để có phương án xử lý thích hợp.
              </Text>
              <Text style={[baseStyles.fontSize16, baseStyles.mv5]}>
                + Yêu cầu người đặt sân đặt trước so với lịch đặt tối thiểu 15
                phút.
              </Text>
              <Text style={[baseStyles.fontSize16, baseStyles.mv5]}>
                + Một trận đấu yêu cầu người thuê đặt tối thiểu 45 phút.
              </Text>
              <Text
                style={[
                  baseStyles.textBold,
                  baseStyles.fontSize18,
                  baseStyles.mt10,
                ]}
              >
                Chủ sân và nhân viên:
              </Text>
              <Text style={[baseStyles.fontSize16, baseStyles.mv5]}>
                + Thường xuyên kiểm tra ứng dụng để biết đơn đặt sân mới.
              </Text>
              <Text style={[baseStyles.fontSize16, baseStyles.mv5]}>
                + Có các phương án xử lý khi có lịch booking trước đó.
              </Text>
              <Text style={[baseStyles.fontSize16, baseStyles.mv5]}>
                + Kiểm tra lịch book trực tiếp và cập nhật ngay vào ứng dụng để
                tránh rủi ro.
              </Text>
              <Text style={[baseStyles.fontSize16, baseStyles.mv5]}>
                + Ưu tiên cho các đơn đặt trong ứng dụng vì người dùng đã chuyển
                tiền.
              </Text>
            </ScrollView>
          </Animated.View>
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.cover]}
          ></Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default SignUp;
