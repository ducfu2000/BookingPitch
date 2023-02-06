import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBuM2tqYbMwvGt2u9bVGA-OyM5-8M3mNqI',
  authDomain: 'datsan-image-db.firebaseapp.com',
  databaseURL: 'https://datsan-image-db-default-rtdb.firebaseio.com',
  projectId: 'datsan-image-db',
  storageBucket: 'datsan-image-db.appspot.com',
  messagingSenderId: '252653349859',
  appId: '1:252653349859:web:04c8d0dc5320081c4d0ed6',
};

export default firebaseConfig;
const config = {
  name: 'SECONDARY_APP',
};

await firebase.initializeApp(firebaseConfig, config);
