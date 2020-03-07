import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonItem,
  IonAvatar,
  IonText,
  IonIcon,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonRange,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

import { addCircleOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import NumericInput from 'react-numeric-input';
import { RefresherEventDetail } from '@ionic/core';

import '../css/iondefaults.css';

const ProfileTab: React.FC = () => {
  const [state, setState] = useState({
    currentTab: 'skills',
  });

  const handleTabOnChange = e =>
    setState({ ...state, currentTab: e.detail.value });

  return (
    <IonPage>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>
              <span
                className="font-title"
                style={{ fontWeight: 900, fontSize: '1.2rem' }}
              >
                squad
              </span>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="shadow-md rounded-b-lg py-8 px-8 w-full flex justify-center items-center">
          <IonText className="text-center w-full flex-1 mr-4">
            <h2 className="font-bold">Rachel Tang</h2>
            <span className="text-gray-500 flex justify-center items-center">
              <img
                src="assets/images/noun_om_32.png"
                className="h-5 mr-1"
                alt="icon"
              />
              Yoga Beginner
            </span>
          </IonText>
          <IonAvatar className="h-20 w-20">
            <img alt="profile" src="assets/images/rachel.jpg" />
          </IonAvatar>
        </div>

        <div className="w-full flex my-8">
          <IonSegment
            value={state.currentTab}
            onIonChange={handleTabOnChange}
            className="m-auto w-64"
          >
            <IonSegmentButton value="skills">
              <span
                className={
                  state.currentTab === 'skills'
                    ? 'text-primary-700 font-bold'
                    : ''
                }
              >
                Skill Levels
              </span>
            </IonSegmentButton>
            <IonSegmentButton value="basic">
              <span
                className={
                  state.currentTab === 'basic'
                    ? 'text-primary-700 font-bold'
                    : ''
                }
              >
                Basic Info
              </span>
            </IonSegmentButton>
          </IonSegment>
        </div>
        {state.currentTab === 'basic' && <BasicInfoSection />}
        {state.currentTab === 'skills' && (
          <div className="flex flex-col px-10">
            <div className="text-2xl font-bold flex">
              <div>Skill Levels</div>
              <div className="flex-1" />
              <div>
                <IonIcon
                  icon={addCircleOutline}
                  size="large"
                  className="text-primary-700"
                />
              </div>
            </div>
            <div className="mt-6">
              <IonCard className="ion-no-margin">
                <IonCardHeader>
                  <IonCardSubtitle className="w-full flex">
                    <div>Main activity</div>
                    <div className="flex-1" />
                    <div className="lowercase text-sm font-normal">Edit</div>
                  </IonCardSubtitle>
                  <IonCardTitle>
                    <div className="flex items-center">
                      <img
                        src="assets/images/om.svg"
                        className="h-8 mr-1 text-black fill-current"
                        alt="icon"
                      />
                      <div className="mt-2 ml-2">Yoga</div>
                    </div>
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <div className="text-sm">My Practice:</div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800 mr-1">
                      Inversion
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800 mr-1">
                      Ashtanga
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800 mr-1">
                      Flow
                    </span>
                  </div>

                  <div className="mt-6">
                    <div>
                      Skill level: <span className="font-bold">Beginner</span>
                    </div>
                    <IonRange
                      min={0}
                      max={4}
                      step={1}
                      value={1}
                      snaps
                      color="primary"
                      disabled
                    >
                      <IonIcon icon={eyeOffOutline} slot="start" />
                      <IonIcon icon={eyeOutline} slot="end" />
                    </IonRange>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
            <div className="mt-6">
              <IonCard className="ion-no-margin">
                <IonCardHeader>
                  <IonCardSubtitle className="w-full flex">
                    <div>Once a week</div>
                    <div className="flex-1" />
                    <div className="lowercase text-sm font-normal">Edit</div>
                  </IonCardSubtitle>
                  <IonCardTitle>
                    <div className="flex items-center">
                      <img
                        src="assets/images/run.svg"
                        className="h-8 mr-1 text-black fill-current"
                        alt="icon"
                      />
                      <div className="mt-2 ml-2">Running</div>
                    </div>
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <div className="w-24 text-sm">My Practice:</div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800 mr-1">
                      Road Races
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800 mr-1">
                      Marathon
                    </span>
                  </div>

                  <div className="mt-6">
                    <div>
                      Skill level:{' '}
                      <span className="font-bold">Intermediate</span>
                    </div>
                    <IonRange
                      min={0}
                      max={4}
                      step={1}
                      value={2}
                      snaps
                      color="primary"
                      disabled
                    >
                      <IonIcon icon={eyeOffOutline} slot="start" />
                      <IonIcon icon={eyeOutline} slot="end" />
                    </IonRange>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          </div>
        )}
        <div className="h-8" />

        <IonList></IonList>

        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
      </IonContent>
    </IonPage>
  );
};

const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
  console.log('Begin async operation');

  setTimeout(() => {
    console.log('Async operation has ended');
    event.detail.complete();
  }, 2000);
};

const BasicInfoSection = () => {
  return (
    <div className="flex flex-col px-10">
      <div className="text-2xl font-bold">
        Basic Info{' '}
        <span className="text-base text-gray-500 font-normal">&nbsp;edit</span>
      </div>
      <div className="mt-4">
        <div className="text-gray-700 mb-1">Gender</div>
        <IonSegment value="female">
          <IonSegmentButton value="male">he/him</IonSegmentButton>
          <IonSegmentButton value="female">
            <span className="text-primary-700 font-bold">she/her</span>
          </IonSegmentButton>
          <IonSegmentButton value="other">they/them</IonSegmentButton>
        </IonSegment>
      </div>
      <div className="mt-4">
        <div className="text-gray-700 mb-1">Overall Fitness Level</div>
        <IonSegment value="medium">
          <IonSegmentButton value="low">low</IonSegmentButton>
          <IonSegmentButton value="medium">
            <span className="text-primary-700 font-bold">medium</span>
          </IonSegmentButton>
          <IonSegmentButton value="high">high</IonSegmentButton>
        </IonSegment>
      </div>
      <div className="mt-4 flex">
        <div className="text-gray-700 mb-1 flex-1">
          <div className="mb-1">Age</div>
          <NumericInput
            value={23}
            min={16}
            max={100}
            step={1}
            precision={0}
            size={4}
            mobile
          />
        </div>
        <div className="text-gray-700 mb-1 flex-1">
          <div className="mb-1">Age Visibility</div>
          <IonSegment value="show">
            <IonSegmentButton value="hide">hide</IonSegmentButton>
            <IonSegmentButton value="show">
              <span className="text-primary-700 font-bold">show</span>
            </IonSegmentButton>
          </IonSegment>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-gray-700 mb-1">
          <>Favourite Workout Place</>
          <IonItem className="ion-float-left w-full text-xl font-semibold ion-no-padding">
            <IonInput value="Squad HQ" />
          </IonItem>
        </div>
      </div>
    </div>
  );
};
export default ProfileTab;
