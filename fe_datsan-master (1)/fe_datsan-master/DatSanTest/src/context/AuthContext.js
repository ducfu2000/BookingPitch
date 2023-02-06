import React, {createContext, useState, useEffect} from 'react';
import SInfo from 'react-native-sensitive-info';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const host = 'http://ec2-52-220-110-248.ap-southeast-1.compute.amazonaws.com';
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState(null);
  const [password, setPassword] = useState(null);
  const [isRememberMe, setIsRememberMe] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  const handleSignInPress = (phoneInput, passwordInput) => {
    setIsLoading(true);
    console.log(phoneInput, passwordInput, isRememberMe);
    fetch(`${host}/api/common/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: phoneInput,
        password: passwordInput,
      }),
    })
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson.message);
        if (
          resJson.message == 'Số điện thoại hoặc mật khẩu không đúng' ||
          resJson.message == 'Tài khoản đã bị khoá' ||
          resJson.message == 'Tài khoản chưa được active' ||
          resJson.role[0].toLowerCase() == 'admin'
        ) {
          alertMessage(
            'Số điện thoại hoặc mật khẩu không đúng',
            'Vui lòng kiểm tra lại số điện thoại và mật khẩu',
            'Đóng',
          );
        } else {
          if (resJson.token !== null && resJson.token !== undefined) {
            setUserToken(resJson.token);
            addDeviceTokenToDB(resJson.token);
            if (isRememberMe) {
              setUserData({
                userToken: resJson.token,
                userRole: resJson.role,
              });
            }
          }
          if (resJson.role) {
            setUserRole(resJson.role);
            setCurrentRole(resJson.role[0].toLowerCase());
          }
        }
        setMessage(resJson.message);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const alertMessage = (title, _message, cancelBtn) => {
    Alert.alert(
      title,
      _message,
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

  const key = '@userData';
  const sharedPreferencesName = 'sharedPass';
  const keychainService = 'keychainPass';

  const signIn = (phoneInput, passwordInput) => {
    setPhone(phoneInput);
    if (isRememberMe) {
      setPassword(passwordInput);
    }
    handleSignInPress(phoneInput, passwordInput);
  };

  const signOut = () => {
    removeUserData(key);
    logout();
  };

  const isLoggedIn = () => {
    getUserData();
  };

  useEffect(() => {
    if (userToken == '' && userRole.length == 0) {
      isLoggedIn();
      console.log(userRole, userToken, currentRole);
    }
  });

  const setUserData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await SInfo.setItem(key, jsonValue, {
        sharedPreferencesName: sharedPreferencesName,
        keychainService: keychainService,
      });
    } catch (error) {
      console.log('Set data user error: ', error);
    }
  };

  const getUserData = async () => {
    try {
      const value = await SInfo.getItem(key, {
        sharedPreferencesName: sharedPreferencesName,
        keychainService: keychainService,
      });
      const userData = value != null ? JSON.parse(value) : null;
      setUserToken(userData.userToken);
      setUserRole(userData.userRole);
      setCurrentRole(userData.userRole[0].toLowerCase());
      console.log(currentRole, 'User data auth context');
    } catch (error) {
      console.log('Get data user error: ', error);
    }
    setIsLoading(false);
  };

  const removeUserData = async () => {
    setIsLoading(true);

    try {
      await SInfo.deleteItem(key, {
        sharedPreferencesName: sharedPreferencesName,
        keychainService: keychainService,
      });
      setUserToken(null);
      setUserRole(null);
    } catch (error) {}
    setIsLoading(false);
  };

  const getAllItems = async () => {
    try {
      const keys = await SInfo.getAllItems({
        sharedPreferencesName: sharedPreferencesName,
        keychainService: keychainService,
      });
    } catch (exception) {}
  };

  const addDeviceTokenToDB = async _userToken => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();
    // Get the token
    const token = await messaging().getToken();
    // Save the token
    console.log(token, 'Device token', _userToken);
    if (token && _userToken) {
      fetch(`${host}/api/common/token/add`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + _userToken,
        },
        body: JSON.stringify({
          token: token,
        }),
      })
        .then(() => {
          console.log(token, 'Device token');
          console.log(message);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const logout = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();
    // Get the token
    const token = await messaging().getToken();
    // Save the token
    if (token && userToken) {
      fetch(`${host}/api/common/logout?token=${token}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Token ' + userToken,
        },
      })
        .then(() => {
          console.log(message);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isLoading,
        setIsLoading,
        phone,
        password,
        userToken,
        userRole,
        host,
        isLoggedIn,
        message,
        isRememberMe,
        setIsRememberMe,
        currentRole,
        setCurrentRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
