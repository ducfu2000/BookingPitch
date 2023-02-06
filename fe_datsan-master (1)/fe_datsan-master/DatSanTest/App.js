import React from 'react';
import {LogBox} from 'react-native';
import AppNavigator from './src/navigations/AppNavigator';
// screens
// extra screens
import {AuthProvider} from './src/context/AuthContext';

LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
