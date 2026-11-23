// Firebase setup: initializes the app, Authentication and Cloud Firestore.
// Values come from Firebase Console > Project settings > General > Your apps (Web app).
// The web apiKey is a public identifier. Real protection comes from the Firestore Security Rules.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyCin0DrD7HXATg82QBbrb3OXW87GbWn74A',
  authDomain: 'beanandbrew-f3899.firebaseapp.com',
  projectId: 'beanandbrew-f3899',
  storageBucket: 'beanandbrew-f3899.firebasestorage.app',
  messagingSenderId: '1082683164214',
  appId: '1:1082683164214:web:2d880897ecc83acb1f3a97',
  measurementId: 'G-653M8PPY1N',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createAuth(): Auth {
  // On the web, Firebase keeps the login in the browser by itself.
  if (Platform.OS === 'web') return getAuth(app);
  // On phones, keep the login in AsyncStorage so the user stays logged in after closing the app.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // Already initialized (fast refresh): reuse it.
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);