import notifee from '@notifee/react-native';

class NotificationService {
  static sendNotification = async (token, title, body) => {
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAOtNQK-M:APA91bHywQsoHRxJ5nwbUCMWvH0ZPjDeAzJbewBWE0yRPR5nz5rjJgh8wONyyBxxxhVkEHBJPfqBMDS31ep5t7WBmGN-C60QNom3bywsE_koSBjxpEN3M3GbJQZVibBg2ePUo5tupKez',
      },
      body: JSON.stringify({
        to: token,
        notification: {
          body: body,
          title: title,
        },
      }),
    }).catch(err => {
      console.log(err);
    });
  };

  static displayLocalNotification = async (title, body) => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Notification',
    });

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        smallIcon: 'ic_logo_notification',
        largeIcon: require('../assets/images/app_logo.png'),
        channelId,
      },
    });
  };
}

export default NotificationService;
