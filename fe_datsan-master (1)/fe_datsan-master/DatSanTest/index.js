/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import NotificationService from './src/services/NotificationService';
messaging().onMessage(async remoteMessage => {
  console.log(
    remoteMessage.notification.title,
    remoteMessage.notification.body,
    'remoteMessage',
  );
  NotificationService.displayLocalNotification(
    remoteMessage.notification.title,
    remoteMessage.notification.body,
  );
});
AppRegistry.registerComponent(appName, () => App);
