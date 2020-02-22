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
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonBadge,
  IonButtons,
} from '@ionic/react';
import Truncate from 'react-truncate';
import {
  notificationsOffOutline,
  trashOutline,
  addOutline,
  searchOutline,
} from 'ionicons/icons';
// @ts-ignore
import NumericInput from 'react-numeric-input';
import { RefresherEventDetail } from '@ionic/core';
// @ts-ignore
import InputNumber from 'rc-input-number';
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
              <button className="flex justify-center items-center bg-gray-500 text-white py-1 px-2 -mt-1 rounded-full ml-2">
                <IonIcon icon={searchOutline} className="h-4 w-4" />
              </button>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <div className="w-full flex my-4">
          <IonSegment value="active" className="m-auto w-64">
            <IonSegmentButton value="active">
              <span className="text-blue-700 font-bold">Active</span>
            </IonSegmentButton>
            <IonSegmentButton value="freinds">Friends</IonSegmentButton>
            <IonSegmentButton value="expired">Expired</IonSegmentButton>
          </IonSegment>
        </div>
        <IonList>
          <IonList>
            <SampleChatroom
              imgSrc="https://images.unsplash.com/flagged/photo-1556746834-cbb4a38ee593?ixlib=rb-1.2.1&auto=format&fit=crop&w=1504&q=80"
              roomTitle="Running - 22/02 Evening"
              notificationsOff={false}
              messageSender="Scott"
              message="I'm here"
              time="4:58pm"
              unreadCount={1}
            />
            <SampleChatroom
              imgSrc="https://www.ilovebicycling.com/wp-content/uploads/2017/10/cycling-at-night-1-768x512.jpg"
              roomTitle="Cycling - 22/02 Evening"
              notificationsOff={true}
              messageSender="Rachel"
              message="See you guys soon! 😄"
              time="4:20pm"
              unreadCount={3}
            />
            <SampleChatroom
              imgSrc="https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80"
              roomTitle="HIIT - 29/02 Afternoon"
              notificationsOff={true}
              messageSender="Maya"
              message="there's a nice tiramisu place nearby!"
              time="4:18pm"
              unreadCount={12}
            />
            <SampleChatroom
              imgSrc="https://images.unsplash.com/photo-1485727749690-d091e8284ef3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
              roomTitle="Yoga - 24/02 Noon"
              notificationsOff={false}
              messageSender="Sid"
              message="I'm considering joining a YTT 🤔"
              time="2:35pm"
              unreadCount={0}
            />

            <SampleChatroom
              imgSrc="https://images.unsplash.com/photo-1575800509571-6a7fd6b61aad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
              roomTitle="Boxing - 26/02 Noon"
              notificationsOff={true}
              messageSender="Max"
              message="Excuse me, anyone has spare wraps?"
              time="4:20pm"
              unreadCount={0}
            />
          </IonList>
        </IonList>

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

const SampleChatroom = (props: any) => {
  const {
    imgSrc,
    roomTitle,
    notificationsOff,
    messageSender,
    message,
    time,
    unreadCount,
  } = props;
  return (
    <IonItemSliding>
      <IonItem>
        <IonAvatar className="h-16 w-16 my-2" slot="start">
          <img alt="profile" src={imgSrc} />
        </IonAvatar>
        <div className="my-2 leading-snug flex-1">
          <div className="font-semibold flex justify-center items-center">
            <div className="w-full flex">
              <Truncate
                lines={1}
                ellipsis={<span>...</span>}
                className="flex-1"
              >
                <span>{roomTitle}</span>
              </Truncate>
              {notificationsOff && (
                <div className="text-gray-500 ml-2">
                  <IonIcon icon={notificationsOffOutline} />
                </div>
              )}
            </div>
          </div>
          <div className="leading-tight text-gray-500 text-sm h-8 overflow-hidden">
            <div className="text-black">{messageSender}</div>
            <Truncate lines={1} ellipsis={<>...</>}>
              <span>{message}</span>
            </Truncate>
          </div>
        </div>
        <div className="w-12 flex flex-col h-full justify-center items-center">
          <div className="text-xs mt-3">{time}</div>
          <div className="flex-1" />
          {!!unreadCount && (
            <div className="mb-1">
              <IonBadge color="medium">{unreadCount}</IonBadge>
            </div>
          )}
        </div>
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="tertiary" onClick={() => {}}>
          <IonIcon
            icon={notificationsOffOutline}
            size="large"
            className="mx-2"
          />
        </IonItemOption>
        <IonItemOption color="danger" onClick={() => {}}>
          <IonIcon icon={trashOutline} size="large" className="mx-2" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default ProfileTab;
