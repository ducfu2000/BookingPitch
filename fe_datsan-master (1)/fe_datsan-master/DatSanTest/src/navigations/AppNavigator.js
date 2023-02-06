import React, {useContext, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AuthContext from '../context/AuthContext';
import SplashScreen from '../components/Splash';
import BottomTabsForUserNavigator from './UserTabsNavigator';
import BottomTabsForEndUserNavigator from './TabsNavigator';
import BottomTabsForManagerNavigator from './ManagerTabsNavigator';

const Welcome = () => {
  const {userRole, isLoggedIn, userToken} = useContext(AuthContext);
  const [currentScreen, setCurrentScreen] = useState('SplashScreen');
  if (userToken === null && userRole === null) {
    isLoggedIn();
    console.log(userRole, userToken);
  }
  console.log(userRole, userToken, 'app navigator');
  setTimeout(() => {
    setCurrentScreen('AppNavigator');
  }, 2000);

  let mainScreen =
    currentScreen === 'SplashScreen' ? <SplashScreen /> : <AppNavigator />;
  return mainScreen;
};

const AppNavigator = () => {
  const {userToken, currentRole} = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!userToken ? (
        <AuthNavigator />
      ) : userToken && currentRole === 'tenant' ? (
        <BottomTabsForEndUserNavigator />
      ) : userToken && currentRole === 'manager' ? (
        <BottomTabsForManagerNavigator />
      ) : (
        userToken && currentRole === 'owner' && <BottomTabsForUserNavigator />
      )}
    </NavigationContainer>
  );
};

export default Welcome;
