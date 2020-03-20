import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router';
import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLoading,
} from '@ionic/react';
import {
  homeOutline,
  chatbubblesOutline,
  addCircleOutline,
  searchOutline,
} from 'ionicons/icons';
import { useSelector } from 'react-redux';
import { useFirestore } from 'react-redux-firebase';

import HomeTab from './pages/HomeTab';
import ActivityTab from './pages/ActivityTab';
import ProfileTab from './pages/ProfileTab';
import SquadsTab from './pages/SquadsTab';
import FindTab from './pages/FindTab';
import { useCurrentPosition } from '@ionic/react-hooks/geolocation';

import { useFirebase } from 'react-redux-firebase';
import stream from 'getstream';
import { StreamContext } from './scripts/StreamContext';

import firebaseApp from 'firebase/app';
const geoCode = firebaseApp.functions().httpsCallable('geoCode');

const AppPage = () => {
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);
  const firebase = useFirebase();
  const { currentPosition } = useCurrentPosition();
  const firestore = useFirestore();

  const client = profile?.streamToken?.data
    ? stream.connect('r6rmg4hju73v', profile.streamToken.data, '72322')
    : null;

  useEffect(() => {
    if (
      currentPosition?.coords?.latitude &&
      currentPosition?.coords?.longitude
    ) {
      const asyncSetAddress = async () => {
        const coodinates = {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        };
        const res = await geoCode(coodinates);
        const address = res.data.results[0];
        if (address) {
          const countryComponentList = address.address_components.filter(
            component => component.types.includes('country')
          );

          if (!!countryComponentList.length) {
            const neighborhoodComponentList = address.address_components.filter(
              component =>
                component.types.includes('neighborhood') ||
                component.types.includes('locality') ||
                component.types.includes('sublocality') ||
                component.types.includes('administrative_area_level_1')
            );

            if (!!neighborhoodComponentList.length) {
              const country = countryComponentList[0].long_name;
              const neighborhood = neighborhoodComponentList[0].long_name;

              const location = {
                country,
                neighborhood,
                details: {
                  address,
                  coodinates,
                },
              };

              firebase.updateProfile({ location });

              const datetime = new Date();
              firestore.collection('location').add({
                user: auth.uid,
                location,
                datetime,
              });
            }
          }
        }
      };
      asyncSetAddress();
    }
  }, [currentPosition, firebase, auth.uid, firestore]);

  return profile?.streamToken?.data ? (
    <StreamContext.Provider value={client}>
      <AppTabs profile={profile} />
    </StreamContext.Provider>
  ) : (
    <IonLoading isOpen={true} translucent />
  );
};

const AppTabs = props => {
  const { profile } = props;
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
