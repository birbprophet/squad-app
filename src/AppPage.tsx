import React, { useState } from 'react';
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
  searchOutline,
  close,
} from 'ionicons/icons';
import { useSelector } from 'react-redux';
import Div100vh from 'react-div-100vh';
import { Link, useLocation } from 'react-router-dom';

import HomeTab from './pages/HomeTab';
import ActivityTab from './pages/ActivityTab';
import ProfileTab from './pages/ProfileTab';
import SquadsTab from './pages/SquadsTab';
import FindTab from './pages/FindTab';

import colorScheme from './colorScheme';

const AppPage = () => {
  const [state, setState] = useState({
    createMenuOpened: false,
  });
  const location = useLocation();
  const profile = useSelector(state => state.firebase.profile);

  const handleToggleCreateMenuOpened = () =>
    setState(state => {
      return { ...state, createMenuOpened: !state.createMenuOpened };
    });

  console.log(location);
  return (
    <>
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
          {location.pathname.startsWith('/app/find') ? (
            <IonTabButton
              tab="find"
              href="/app/find"
              onClick={handleToggleCreateMenuOpened}
            >
              <IonIcon icon={addCircleOutline} className="text-primary-700" />
            </IonTabButton>
          ) : (
            <IonTabButton tab="find" onClick={handleToggleCreateMenuOpened}>
              <IonIcon icon={addCircleOutline} />
            </IonTabButton>
          )}
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

      {state.createMenuOpened && (
        <div className="absolute w-full">
          <Div100vh>
            <div className="w-full h-full bg-white opacity-75 absolute"></div>
            <div className="w-full h-full flex flex-col relative z-10">
              <div className="flex-1"></div>
              <div className="pt-6 w-full px-6 pb-1">
                <Link to="/app/find">
                  <button
                    className="py-4 text-lg w-full font-semibold text-white rounded px-4 bg-primary-800 text-center"
                    onClick={handleToggleCreateMenuOpened}
                  >
                    Find Activity
                  </button>
                </Link>
                <Link to="/app/find/group">
                  <button
                    className="py-4 text-lg w-full font-medium text-primary-800 rounded px-4 bg-white text-center mt-4"
                    style={{
                      border: `solid 2px ${colorScheme['primary-800']}`,
                    }}
                    onClick={handleToggleCreateMenuOpened}
                  >
                    Create Group
                  </button>
                </Link>
                <div className="mt-6 w-full flex">
                  <div
                    className="m-auto text-white bg-primary-800 rounded-full h-10 w-10 flex"
                    onClick={handleToggleCreateMenuOpened}
                  >
                    <IonIcon icon={close} className="m-auto h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </Div100vh>
        </div>
      )}
    </>
  );
};

export default AppPage;
