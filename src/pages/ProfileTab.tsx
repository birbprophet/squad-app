import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonItemGroup,
  IonItem,
  IonAvatar,
  IonText,
  IonIcon,
  IonList,
  IonListHeader,
  IonItemDivider,
  IonSegment,
  IonSegmentButton,
  IonRange,
  IonInput,
} from '@ionic/react';

import { chevronForwardOutline } from 'ionicons/icons';
import NumericInput from 'react-numeric-input';
import { RefresherEventDetail } from '@ionic/core';

import './ProfileTab.css';

const ProfileTab: React.FC = () => {
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
            <h2 className="font-bold">Benjamin Tang</h2>
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
            <img
              alt="profile"
              src="https://scontent.fsin3-1.fna.fbcdn.net/v/t1.0-9/67214406_2642116952486182_4117217862546882560_o.jpg?_nc_cat=109&_nc_ohc=pOKfPjd5_s8AX9oK6S0&_nc_ht=scontent.fsin3-1.fna&oh=afc45f992a09dc7f1524b37f8ee78e67&oe=5F020112"
            />
          </IonAvatar>
        </div>

        <div className="w-full flex my-8">
          <IonSegment value="basic" className="m-auto w-64">
            <IonSegmentButton value="freinds">Skill Levels</IonSegmentButton>
            <IonSegmentButton value="basic">
              <span className="text-blue-700 font-bold">Basic Info</span>
            </IonSegmentButton>
          </IonSegment>
        </div>
        <div className="flex flex-col px-10">
          <div className="text-2xl font-bold">
            Basic Info{' '}
            <span className="text-base text-gray-500 font-normal">
              &nbsp;edit
            </span>
          </div>
          <div className="mt-4">
            <div className="text-gray-700 mb-1">Gender</div>
            <IonSegment value="male">
              <IonSegmentButton value="male">
                <span className="text-blue-700 font-bold">he/him</span>
              </IonSegmentButton>
              <IonSegmentButton value="female">she/her</IonSegmentButton>
              <IonSegmentButton value="other">they/them</IonSegmentButton>
            </IonSegment>
          </div>
          <div className="mt-4">
            <div className="text-gray-700 mb-1">Overall Fitness Level</div>
            <IonSegment value="medium">
              <IonSegmentButton value="low">low</IonSegmentButton>
              <IonSegmentButton value="medium">
                <span className="text-blue-700 font-bold">medium</span>
              </IonSegmentButton>
              <IonSegmentButton value="high">high</IonSegmentButton>
            </IonSegment>
          </div>
          <div className="mt-4 flex">
            <div className="text-gray-700 mb-1 flex-1">
              <div className="mb-1">Age</div>
              <NumericInput
                value={25}
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
                  <span className="text-blue-700 font-bold">show</span>
                </IonSegmentButton>
              </IonSegment>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-gray-700 mb-1">
              <>Favourite Workout Place</>
              <IonItem className="ion-float-left w-full text-xl font-semibold ion-no-padding">
                <IonInput />
              </IonItem>
            </div>
          </div>
        </div>
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

export default ProfileTab;
