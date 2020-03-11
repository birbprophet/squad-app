import React from 'react';
import { Route, Redirect } from 'react-router';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonAvatar,
  IonLoading,
} from '@ionic/react';
import {
  homeOutline,
  chatbubblesOutline,
  addCircleOutline,
  personCircleOutline,
  searchOutline,
} from 'ionicons/icons';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

import HomeTab from './pages/HomeTab';
import ActivityTab from './pages/ActivityTab';
import ProfileTab from './pages/ProfileTab';
import SquadsTab from './pages/SquadsTab';
import FindTab from './pages/FindTab';

const AppPage = () => {
  const profile = useSelector(state => state.firebase.profile);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/app/home" component={HomeTab} />
        <Route path="/app/activity" component={ActivityTab} />
        <Route path="/app/find" component={FindTab} />
        <Route path="/app/squads" component={SquadsTab} />
        <Route path="/app/profile" component={ProfileTab} />
        <Route
          path="/app/"
          render={() => <Redirect to="/app/profile" />}
          exact={true}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/app/home">
          <IonIcon icon={homeOutline} />
        </IonTabButton>
        <IonTabButton tab="activity" href="/app/activity">
          <IonIcon icon={searchOutline} />
        </IonTabButton>
        <IonTabButton tab="find" href="/app/find">
          <IonIcon icon={addCircleOutline} />
        </IonTabButton>
        <IonTabButton tab="squads" href="/app/squads">
          <IonIcon icon={chatbubblesOutline} />
        </IonTabButton>
        <IonTabButton tab="profile" href="/app/profile">
          <img
            src={profile?.profilePictureUrls.size_64}
            alt="profile"
            className="h-7 w-7 rounded-full"
          />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppPage;
