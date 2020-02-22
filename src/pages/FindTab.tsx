import React, { useRef, useEffect } from 'react';
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
  IonSpinner,
  IonButton,
  IonCard,
  IonButtons,
} from '@ionic/react';

import {
  chevronForwardOutline,
  arrowBackOutline,
  chevronBackOutline,
  addOutline,
} from 'ionicons/icons';
import { ClapSpinner } from 'react-spinners-kit';
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
            <IonButtons slot="end">
              <button className="flex justify-center items-center bg-blue-700 text-white py-1 px-2 -mt-1 rounded-full mr-2">
                <IonIcon icon={addOutline} className="h-4 w-4" />
              </button>
            </IonButtons>
            <IonButtons slot="start">
              <div className="flex justify-between items-center text-gray-500 ml-2">
                <IonIcon icon={chevronBackOutline} className="h-3 w-3" />
                <div className="leading-4 ml-1">Back</div>
              </div>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <div className="w-full h-full flex">
          <div className="m-auto w-full flex flex-col items-center">
            <ClapSpinner size={100} frontColor="#EBF8FF" backColor="#2B6CB0" />
            <div className="mt-24 text-2xl font-semibold text-center text-black">
              Hold Tight
            </div>
            <div className="text-lg">We're finding the best squad for you</div>
            <div className="flex items-center mt-4">
              <button className="flex justify-center items-center bg-blue-700 text-white py-1 px-2 rounded-full w-20 mx-1">
                <div className="leading-5 ml-1 font-semibold">Edit</div>
              </button>
              <button className="flex justify-center items-center bg-gray-500 text-white py-1 px-2 rounded-full w-20 mx-1">
                <div className="leading-5 ml-1 font-semibold">Cancel</div>
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
