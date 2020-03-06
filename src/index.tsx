import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { store, rrfProps } from './scripts/reduxFirebaseStore';
import FirebaseProvider from './components/FirebaseProvider';

import App from './App';
import * as serviceWorker from './serviceWorker';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

ReactDOM.render(
  <FirebaseProvider>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <App />
      </ReactReduxFirebaseProvider>
    </Provider>
  </FirebaseProvider>,
  document.getElementById('root')
);
defineCustomElements(window);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
