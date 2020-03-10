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
import ProfileTab from './pages/ProfileTab';
import SquadsTab from './pages/SquadsTab';
import FindTab from './pages/FindTab';

const AppPage = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/app/home" component={HomeTab} />
        <Route path="/app/squads" component={SquadsTab} />
        <Route path="/app/find" component={FindTab} />
        <Route path="/app/activity" component={ActivityTab} />
        <Route path="/app/profile" component={ProfileTab} />
        <Route
          path="/app/"
          render={() => <Redirect to="/app/find" />}
          exact={true}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/app/home">
          <IonIcon icon={homeOutline} />
        </IonTabButton>
        <IonTabButton tab="squads" href="/app/squads">
          <IonIcon icon={chatbubblesOutline} />
        </IonTabButton>
        <IonTabButton tab="find" href="/app/find">
          <IonIcon icon={addCircleOutline} />
        </IonTabButton>
        <IonTabButton tab="activity" href="/app/activity">
          <IonIcon icon={notificationsOutline} />
        </IonTabButton>
        <IonTabButton tab="profile" href="/app/profile">
          <IonIcon icon={personCircleOutline} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppPage;
