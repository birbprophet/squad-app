import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonMenuButton,
  IonActionSheet,
  IonCard,
} from '@ionic/react';
import { useSelector } from 'react-redux';

import '../css/iondefaults.css';
import { useFirebase } from 'react-redux-firebase';
import {
  femaleOutline,
  maleOutline,
  locationOutline,
  close,
  chatbubblesOutline,
  calendarOutline,
  mapOutline,
} from 'ionicons/icons';

import { useCurrentPosition } from '@ionic/react-hooks/geolocation';

import { skillLevelMap } from '../scripts/consts';
import { Link } from 'react-router-dom';

const ProfileTab = () => {
  const profile = useSelector(state => state.firebase.profile);
  const firebase = useFirebase();
  const [state, setState] = useState({
    showActionMenu: false,
    currentTab: 'Upcoming',
    currentPosition: null,
  });
  const { currentPosition, getPosition } = useCurrentPosition();

  useEffect(() => {
    if (
      !(
        JSON.stringify(state.currentPosition) ===
        JSON.stringify(currentPosition)
      )
    ) {
      setState(state => {
        return {
          ...state,
          currentPosition,
        };
      });
    }
  }, [state.currentPosition, currentPosition]);

  const handleLogoutOnClick = () => {
    firebase.logout();
  };

  const handleOpenActionMenu = () => {
    setState(state => {
      return {
        ...state,
        showActionMenu: true,
      };
    });
  };
  useEffect(() => {}, []);

  const handleCloseActionMenu = () => {
    setState(state => {
      return {
        ...state,
        showActionMenu: false,
      };
    });
  };

  const handleSetTab = tab => {
    setState(state => {
      return {
        ...state,
        currentTab: tab,
      };
    });
  };

  const handleLocationOnClick = () => {
    getPosition();
  };

  return (
    <IonPage>
      <IonContent className="ion-content-gray">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>
              <span className="font-title" style={{ fontWeight: 900 }}>
                @{profile.username}
              </span>
            </IonTitle>
            <IonButtons slot="end">
              <IonMenuButton
                autoHide={false}
                color="dark"
                onClick={handleOpenActionMenu}
              />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="relative w-full flex items-center shadow-md bg-white z-10">
          <div className="p-8">
            <img
              src={profile.profilePictureUrl}
              alt="profile"
              className="h-20 w-20 rounded-full"
            />
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-700">
              {profile.activities[0].displayName} -{' '}
              {skillLevelMap[profile.activities[0].activitySkillLevel]}
            </div>
            <div className="font-semibold text-black text-xl mt-1">
              {profile.firstName} {profile.lastName}
            </div>
            <div className="flex mt-2">
              <div className="flex text-sm items-center">
                {profile.gender === 'male' ? (
                  <>
                    <IonIcon icon={maleOutline} />
                    <span className="ml-1">Male</span>
                  </>
                ) : (
                  <>
                    <IonIcon icon={femaleOutline} />
                    <span className="ml-1">Female</span>
                  </>
                )}
              </div>
              <div
                className="flex text-sm items-center ml-2"
                onClick={handleLocationOnClick}
              >
                <IonIcon icon={locationOutline} />
                <span className="ml-1">
                  {profile.location?.neighborhood || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full text-center pt-4 text-gray-400 bg-white">
          {['Upcoming', 'Past', 'Friends'].map(tabName => {
            return (
              <React.Fragment key={tabName}>
                {tabName === state.currentTab ? (
                  <div
                    className="flex-1 py-4"
                    style={{ borderBottom: 'solid #844454 4px' }}
                  >
                    <span className="text-primary-700 font-bold">
                      {tabName}
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex-1 py-4"
                    onClick={() => handleSetTab(tabName)}
                  >
                    <span>{tabName}</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        {state.currentTab === 'Upcoming' && <UpcomingSubTab />}
        {state.currentTab === 'Past' && <PastSubTab />}

        <IonActionSheet
          isOpen={state.showActionMenu}
          onDidDismiss={handleCloseActionMenu}
          buttons={[
            {
              text: 'Settings',
              handler: handleLogoutOnClick,
              cssClass: 'dark',
            },
            {
              text: 'Logout',
              role: 'destructive',
              handler: handleLogoutOnClick,
            },
            {
              text: 'Close',
              icon: close,
              role: 'cancel',
              cssClass: 'dark',
            },
          ]}
        ></IonActionSheet>
      </IonContent>
    </IonPage>
  );
};

const PastSubTab = () => {
  return (
    <div className="w-full">
      <div className="m-6 p-6 bg-gray-100 rounded-lg">
        <div className="font-medium text-lg">No activities yet</div>
        <div className="mt-2 text-gray-500">
          Let's start by finding an activity to join
        </div>
        <div className="mt-6">
          <Link to="/app/find" className="no-underline">
            <button className="py-4 flex-1 font-medium text-white flex rounded px-4 bg-primary-800 no-underline">
              Find Activity
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const UpcomingSubTab = () => {
  return (
    <div className="w-full">
      <IonCard className="ion-no-padding">
        <div className="pt-6 pb-4">
          <div className="pb-6 px-6" style={{ borderBottom: 'solid #CCC 1px' }}>
            <div className="font-bold text-2xl text-black">HIIT</div>
            <div className="text-gray-700 mt-2 font-medium">
              Tomorrow, 12 Mar, 1:00 PM - 2:00 PM
            </div>
            <div className="text-gray-500 mt-2 font-medium">F45 Boat Quay</div>
            <div className="text-gray-500 mt-1 font-medium">
              73/75 South Bridge Rd, Singapore 058705
            </div>
          </div>
          <div className="px-6 pt-4 flex items-center">
            <div className="text-primary-700 flex items-center">
              <IonIcon icon={chatbubblesOutline} className="w-6 h-6" />
              <div className="ml-2 text-lg font-bold">Go to chat</div>
            </div>
            <div className="flex-1"></div>
            <div className="mr-4">
              <IonIcon icon={mapOutline} className="w-6 h-6 text-primary-700" />
            </div>
            <div>
              <IonIcon
                icon={calendarOutline}
                className="w-6 h-6 text-primary-700"
              />
            </div>
          </div>
        </div>
      </IonCard>
    </div>
  );
};

export default ProfileTab;
