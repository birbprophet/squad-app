import React from 'react';
import { Route, Redirect } from 'react-router';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from '@ionic/react';
import {
  homeOutline,
  chatbubblesOutline,
  addCircleOutline,
  notificationsOutline,
  personCircleOutline,
} from 'ionicons/icons';

import HomeTab from './pages/HomeTab';
import ActivityTab from './pages/ActivityTab';
import ProfileTab from './pages/SquadsTab';
import SquadsTab from './pages/SquadsTab';
import FindTab from './pages/FindTab';

const AppPage = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/home" component={HomeTab} exact={true} />
        <Route path="/squads" component={SquadsTab} exact={true} />
        <Route path="/find" component={FindTab} exact={true} />
        <Route path="/activity" component={ActivityTab} exact={true} />
        <Route path="/Profile" component={ProfileTab} exact={true} />
        <Route path="/" render={() => <Redirect to="/find" />} exact={true} />
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
  );
};

export default AppPage;
