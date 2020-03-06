import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import { createStore, combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyDIBRxDoxB44aESE2p85FgNxoFftSau4Zk',
  authDomain: 'the-squad-app.firebaseapp.com',
  databaseURL: 'https://the-squad-app.firebaseio.com',
  projectId: 'the-squad-app',
  storageBucket: 'the-squad-app.appspot.com',
  messagingSenderId: '400184238850',
  appId: '1:400184238850:web:15e1d667033b9baf9b981b',
  measurementId: 'G-NGXEHVW9F2',
};

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.firestore();

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

const initialState = {};

export const store = createStore(rootReducer, initialState);

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};
