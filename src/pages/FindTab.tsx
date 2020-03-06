import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonCard,
  IonButtons,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonDatetime,
} from '@ionic/react';

import './ProfileTab.css';

const FindTab: React.FC = () => {
  const [state, setState] = useState({
    currentView: 'find',
  });
  return (
    <IonPage>
      <IonContent>
        <div className="flex flex-col px-10 items-center h-full">
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
              <IonButtons slot="end"></IonButtons>
              <IonButtons slot="start"></IonButtons>
            </IonToolbar>
          </IonHeader>

          {state.currentView === 'find' && (
            <div className="text-3xl font-bold flex flex-col mt-8">
              <div>Squad Preferences</div>
              <div className="mt-6">
                <IonCard className="ion-no-margin">
                  <IonCardHeader>
                    <IonCardSubtitle className="w-full flex">
                      <div>Selected activity</div>
                      <div className="flex-1" />
                      <div className="lowercase text-sm font-normal">Edit</div>
                    </IonCardSubtitle>
                    <IonCardTitle>
                      <div className="flex items-center">
                        <img
                          src="assets/images/cycle.svg"
                          className="h-8 mr-1 text-black fill-current"
                          alt="icon"
                        />
                        <div className="mt-2 ml-2">Cycling</div>
                      </div>
                    </IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent>
                    <div className="text flex">
                      <div>Subactivity Choice(s):</div>
                    </div>
                    <div className="mt-2 flex">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800 mr-1">
                        Night Cycling
                      </span>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
              <div className="mt-6 mb-8">
                <IonCard className="ion-no-margin">
                  <IonCardHeader>
                    <IonCardSubtitle className="w-full flex">
                      <div>Preferred Time/Date</div>
                      <div className="flex-1" />
                      <div className="lowercase text-sm font-normal">Edit</div>
                    </IonCardSubtitle>
                    <IonCardTitle>
                      <div className="flex items-center">
                        <img
                          src="assets/images/night.svg"
                          className="h-8 mr-1 text-black fill-current"
                          alt="icon"
                        />
                        <div className="mt-2 ml-2">Night</div>
                      </div>
                    </IonCardTitle>
                  </IonCardHeader>

                  <IonCardContent>
                    <div className="text flex">
                      <div>Available Dates:</div>
                    </div>
                    <div className="mt-2 flex">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800 mr-1">
                        <IonDatetime
                          className="ion-no-margin ion-no-padding"
                          value="2020-03-15"
                          min="2020-01"
                          max="2030"
                          displayFormat="DD MMM, YY"
                          monthShortNames="Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec"
                        ></IonDatetime>
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-4 bg-gray-100 text-gray-800 mr-1">
                        + Add Date
                      </span>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
              <div className="mb-8">
                <span className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => setState({ ...state, currentView: 'found' })}
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-pink active:bg-primary-700 transition ease-in-out duration-150"
                  >
                    Find Squad
                  </button>
                </span>
              </div>
            </div>
          )}
          {state.currentView === 'found' && (
            <>
              <IonCard className="my-auto w-full p-2">
                <IonCardHeader>
                  <IonCardTitle>
                    <div className="flex items-center">
                      <div className="">Success!</div>
                    </div>
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <div className="text flex">
                    <div>You've found a Squad:</div>
                  </div>
                  <div className="mt-2 flex items-center justify-center">
                    <div className="w-full flex ">
                      <IonAvatar>
                        <img
                          alt="profile"
                          src={
                            'https://www.ilovebicycling.com/wp-content/uploads/2017/10/cycling-at-night-1-768x512.jpg'
                          }
                        />
                      </IonAvatar>
                      <div className=" mt-3 ml-4 font-bold border-red-300 ">
                        <span role="img" aria-label="emoji" className="text-lg">
                          Cycling - 3 Mar 🌙
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex relative z-0 overflow-hidden mt-4 items-end">
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
                    <img
                      className="relative z-0 -ml-1 inline-block h-6 w-6 rounded-full text-white shadow-solid"
                      src="assets/images/yuqing2.jpg"
                      alt=""
                    />
                    <div className="text-xs ml-3">With Yuqing and 4 others</div>
                  </div>
                  <div className="mt-8 flex items-end">
                    <div>
                      <span className="inline-flex rounded-md shadow-sm">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:border-primary-700 focus:shadow-outline-indigo active:bg-primary-700 transition ease-in-out duration-150"
                          onClick={() =>
                            setState({ ...state, currentView: 'find' })
                          }
                        >
                          Go to chat
                        </button>
                      </span>
                    </div>
                    <div className="flex-1" />
                  </div>
                </IonCardContent>
              </IonCard>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FindTab;
