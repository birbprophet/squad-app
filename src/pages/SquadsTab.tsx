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
  IonIcon,
  IonList,
  IonSegment,
  IonSegmentButton,
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
  settingsOutline,
  chevronBack,
} from 'ionicons/icons';
import { RefresherEventDetail } from '@ionic/core';
import './ProfileTab.css';

const SquadsTab: React.FC = () => {
  const [state, setState] = useState({
    currentPage: 'all',
  });

  return (
    <IonPage>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>
              {state.currentPage === 'all' ? (
                <span
                  className="font-title"
                  style={{ fontWeight: 900, fontSize: '1.2rem' }}
                >
                  SQUAD
                </span>
              ) : (
                <>Cycling - 3 Mar 🌙</>
              )}
            </IonTitle>
            {state.currentPage === 'all' ? (
              <> </>
            ) : (
              <>
                <IonButtons slot="end">
                  <button className="flex justify-center items-center bg-primary-700 text-white py-1 px-2 -mt-1 rounded-full mr-2">
                    <IonIcon icon={settingsOutline} className="h-4 w-4" />
                  </button>
                </IonButtons>
                <IonButtons slot="start">
                  <div
                    className="flex items-center ml-2"
                    onClick={() => setState({ ...state, currentPage: 'all' })}
                  >
                    <IonIcon icon={chevronBack} className="h-4 w-4" />
                    <div>Back</div>
                  </div>
                </IonButtons>
              </>
            )}
          </IonToolbar>
        </IonHeader>
        {state.currentPage === 'all' && (
          <>
            <div className="w-full flex my-4">
              <IonSegment value="active" className="m-auto w-64">
                <IonSegmentButton value="active">
                  <span className="text-primary-700 font-bold">Active</span>
                </IonSegmentButton>
                <IonSegmentButton value="freinds">Friends</IonSegmentButton>
                <IonSegmentButton value="past">Past</IonSegmentButton>
              </IonSegment>
            </div>
            <IonList>
              <IonList>
                <SampleChatroom
                  imgSrc="https://images.unsplash.com/flagged/photo-1556746834-cbb4a38ee593?ixlib=rb-1.2.1&auto=format&fit=crop&w=1504&q=80"
                  roomTitle="Running - 2 Mar 🌙"
                  notificationsOff={false}
                  messageSender="Scott"
                  message="I'm here"
                  time="8:58 PM"
                  unreadCount={1}
                />
                <div
                  onClick={() => setState({ ...state, currentPage: 'chat' })}
                >
                  <SampleChatroom
                    imgSrc="https://www.ilovebicycling.com/wp-content/uploads/2017/10/cycling-at-night-1-768x512.jpg"
                    roomTitle="Cycling - 3 Mar 🌙"
                    notificationsOff={true}
                    messageSender="Yuqing"
                    message="See you guys soon! Should we meet at"
                    time="8:21 PM"
                    unreadCount={3}
                  />
                </div>

                <SampleChatroom
                  imgSrc="https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80"
                  roomTitle="HIIT - 6 Mar ☀️"
                  notificationsOff={true}
                  messageSender="Maya"
                  message="there's a nice tiramisu place nearby!"
                  time="4:18 PM"
                  unreadCount={12}
                />
                <SampleChatroom
                  imgSrc="https://images.unsplash.com/photo-1485727749690-d091e8284ef3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
                  roomTitle="Yoga - 9 Mar 🌅"
                  notificationsOff={false}
                  messageSender="Sid"
                  message="I'm considering joining a YTT 🤔"
                  time="2:35 PM"
                  unreadCount={0}
                />

                <SampleChatroom
                  imgSrc="https://images.unsplash.com/photo-1575800509571-6a7fd6b61aad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
                  roomTitle="Boxing - 10 Mar 🌇"
                  notificationsOff={true}
                  messageSender="Max"
                  message="Excuse me, anyone has spare wraps?"
                  time="8:06 AM"
                  unreadCount={0}
                />
              </IonList>
            </IonList>
          </>
        )}

        {state.currentPage === 'chat' && (
          <div className="bg-primary-50 h-full">
            <div className="w-full flex flex-col">
              <div className="mx-auto mt-8">
                <div className="bg-white p-4 shadow-md rounded-lg">
                  <div className="w-64">
                    <div className="text-gray-500">
                      <span className="font-bold text-gray-700">@SquadBot</span>{' '}
                      started a poll
                    </div>
                    <div className="font-semibold text-lg">
                      Confirm your availability:
                    </div>
                    <div className="mt-4 flex">
                      <div>
                        <span className="inline-flex rounded-md shadow-sm">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-pink active:bg-primary-700 transition ease-in-out duration-150"
                          >
                            Confirm
                          </button>
                        </span>
                      </div>
                      <div className="ml-2">
                        <span className="inline-flex rounded-md shadow-sm">
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-50 focus:outline-none focus:border-gray-300 focus:shadow-outline-gray active:bg-gray-200 transition ease-in-out duration-150"
                          >
                            Decline
                          </button>
                        </span>
                      </div>
                    </div>
                    <div className="w-full flex mt-4  items-end">
                      <div className="text-xs text-gray-500 ml-1">
                        Yuqing +2 confirmed
                      </div>
                      <div className="flex-1" />
                      <div className="flex relative z-0 overflow-hidden">
                        <img
                          className="relative z-30 inline-block h-6 w-6 rounded-full text-white shadow-solid"
                          src="assets/images/yuqing.jpg"
                          alt=""
                        />
                        <img
                          className="relative z-20 -ml-1 inline-block h-6 w-6 rounded-full text-white shadow-solid"
                          src="assets/images/rachel.jpg"
                          alt=""
                        />
                        <img
                          className="relative z-10 -ml-1 inline-block h-6 w-6 rounded-full text-white shadow-solid"
                          src="assets/images/kyungju.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex">
                  <div className="flex-1" />
                  <div className="text-xs mt-2 mr-2">8:15 PM</div>
                </div>
              </div>
              <div className="mt-8 px-4 flex">
                <img
                  className="relative inline-block h-10 w-10 rounded-full"
                  src="assets/images/yuqing.jpg"
                  alt=""
                />
                <div>
                  <div className="bg-primary-500 mx-4 text-sm leading-5 px-4 py-3 rounded-lg text-white">
                    See you guys soon! Should we meet at the food center and
                    walk over to the bicycle rental together?
                  </div>
                  <div className="text-xs ml-6 mt-2">8:21 PM</div>
                </div>
              </div>
              <div className="absolute bottom-0 mt-8 w-full flex">
                <div className="bg-white w-full px-4 py-2 flex items-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-500 stroke-current"
                  >
                    <path
                      d="M15.1716 7L8.58579 13.5858C7.80474 14.3668 7.80474 15.6332 8.58579 16.4142C9.36684 17.1953 10.6332 17.1953 11.4142 16.4142L17.8284 9.82843C19.3905 8.26633 19.3905 5.73367 17.8284 4.17157C16.2663 2.60948 13.7337 2.60948 12.1716 4.17157L5.75736 10.7574C3.41421 13.1005 3.41421 16.8995 5.75736 19.2426C8.1005 21.5858 11.8995 21.5858 14.2426 19.2426L20.5 13"
                      stroke="#4A5568"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    className="w-full mx-2 px-2 outline-pink"
                    placeholder="Say something..."
                  />

                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 11L12 8M12 8L15 11M12 8L12 16M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                      stroke="#4A5568"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
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
              {/* {notificationsOff && (
                <div className="text-gray-500 ml-2">
                  <IonIcon icon={notificationsOffOutline} />
                </div>
              )} */}
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

export default SquadsTab;
