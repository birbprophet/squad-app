import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { setupConfig, IonApp, IonLoading } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// import { useGetInfo } from '@ionic/react-hooks/device';
import { useSelector } from 'react-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';

import './css/index.css';
import './css/styles.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import 'typeface-montserrat';
import 'typeface-droid-serif';
import 'typeface-lato';

import AppPage from './AppPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';

setupConfig({
  mode: 'ios',
});

const App: React.FC = () => {
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

  const isLoading = !isLoaded(auth) || !isLoaded(profile);
  const isLoggedIn = !isLoading && !isEmpty(auth);
  const isRegisteredUser = !isLoggedIn && !isEmpty(profile);

  return (
    <IonApp>
      <IonReactRouter>
        <Route
          path="/"
          render={() => {
            if (isLoading) {
              return <IonLoading isOpen={true} translucent />;
            } else if (!isLoggedIn) {
              return <Redirect to="/login" />;
            } else if (isLoggedIn && !isRegisteredUser) {
              return <Redirect to="/welcome" />;
            } else {
              return <Redirect to="/app" />;
            }
          }}
          exact={true}
        />
        <Route
          path="/login"
          render={() => {
            if (isLoading) {
              return <IonLoading isOpen={true} translucent />;
            } else if (!isLoggedIn) {
              return <LoginPage />;
            } else if (isLoggedIn && !isRegisteredUser) {
              return <Redirect to="/welcome" />;
            } else {
              return <Redirect to="/app" />;
            }
          }}
          exact={true}
        />
        <Route
          path="/welcome"
          render={() => {
            if (isLoading) {
              return <IonLoading isOpen={true} translucent />;
            } else if (!isLoggedIn) {
              return <Redirect to="/login" />;
            } else if (isLoggedIn && !isRegisteredUser) {
              return <WelcomePage />;
            } else {
              return <Redirect to="/app" />;
            }
          }}
          exact={true}
        />
        ``
        <Route
          path="/app"
          render={() => {
            if (isLoading) {
              return <IonLoading isOpen={true} translucent />;
            } else if (!isLoggedIn) {
              return <Redirect to="/login" />;
            } else if (isLoggedIn && !isRegisteredUser) {
              return <Redirect to="/welcome" />;
            } else {
              return <AppPage />;
            }
          }}
        />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

// if (
//   info?.operatingSystem &&
//   ['windows', 'mac', 'unknown'].includes(info?.operatingSystem)
// ) {
//   return (
//     <IonApp>
//       <IonReactRouter>
//         <IonRouterOutlet>
//           <Route
//             path="/"
//             render={() => {
//               window.location.href = 'https://squad.fitness';
//               return null;
//             }}
//           />
//         </IonRouterOutlet>
//       </IonReactRouter>
//     </IonApp>
//   );
// }
