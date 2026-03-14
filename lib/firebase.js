import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAtbOmJ2ilBOTud6IQSIIQ4weazxCF9-Y4',
  authDomain: 'nowhy-73c93.firebaseapp.com',
  projectId: 'nowhy-73c93',
  storageBucket: 'nowhy-73c93.firebasestorage.app',
  messagingSenderId: '959462359865',
  appId: '1:959462359865:web:96f8acba401cafb0a11ee8',
  measurementId: 'G-N2XV4ZDT7X',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
