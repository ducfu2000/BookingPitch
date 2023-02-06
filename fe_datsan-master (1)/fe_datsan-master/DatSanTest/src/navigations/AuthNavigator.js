import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  SignIn,
  SignUp,
  VerifyAccount,
  ForgotPassword,
  ChangePassword,
} from '../screens';

const AuthNavigator = () => {
  const AuthStack = createNativeStackNavigator();

  return (
    <AuthStack.Navigator
      initialRouteName={'SignIn'}
      screenOptions={{headerShown: false}}
    >
      <AuthStack.Screen
        name="SignIn"
        options={{headerShown: false}}
        component={SignIn}
      />
      <AuthStack.Screen
        name="SignUp"
        options={{
          title: 'Đăng ký',
        }}
        component={SignUp}
      />
      <AuthStack.Screen
        name="Validation"
        options={{
          title: 'Xác minh',
        }}
        component={VerifyAccount}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        options={{
          title: 'Quên mật khẩu',
        }}
        component={ForgotPassword}
      />
      <AuthStack.Screen
        name="ChangePassword"
        options={{
          title: 'Đổi mật khẩu',
        }}
        component={ChangePassword}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
