import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  setupConfig,
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { useGetInfo } from '@ionic/react-hooks/device';

import {
  homeOutline,
  chatbubblesOutline,
  addCircleOutline,
  notificationsOutline,
  personCircleOutline,
} from 'ionicons/icons';

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
import 'typeface-hind';

import HomeTab from './pages/HomeTab';
import SquadsTab from './pages/SquadsTab';
import FindTab from './pages/FindTab';
import ActivityTab from './pages/ActivityTab';
import ProfileTab from './pages/ProfileTab';

setupConfig({
  mode: 'ios',
});

const App: React.FC = () => {
  const { info } = useGetInfo();
  console.log(info);

  // if (
  //   info?.operatingSystem &&
  //   ["windows", "mac", "unknown"].includes(info?.operatingSystem)
  // ) {
  //   return (
  //     <IonApp>
  //       <IonReactRouter>
  //         <IonRouterOutlet>
  //           <Route
  //             path="/"
  //             render={() => {
  //               window.location.href = "https://squad.fitness";
  //               console.log("passed");
  //               return null;
  //             }}
  //           />
  //         </IonRouterOutlet>
  //       </IonReactRouter>
  //     </IonApp>
  //   );
  // }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home" component={HomeTab} exact={true} />
            <Route path="/squads" component={SquadsTab} exact={true} />
            <Route path="/find" component={FindTab} exact={true} />
            <Route path="/activity" component={ActivityTab} exact={true} />
            <Route path="/Profile" component={ProfileTab} exact={true} />
            <Route
              path="/"
              render={() => <Redirect to="/find" />}
              exact={true}
            />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
            </IonTabButton>
            <IonTabButton tab="squads" href="/squads">
              <IonIcon icon={chatbubblesOutline} />
            </IonTabButton>
            <IonTabButton tab="find" href="/find">
              <IonIcon icon={addCircleOutline} />
            </IonTabButton>
            <IonTabButton tab="activity" href="/activity">
              <IonIcon icon={notificationsOutline} />
            </IonTabButton>
            <IonTabButton tab="profile" href="/profile">
              <IonIcon icon={personCircleOutline} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
