import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonList,
  IonToggle,
  IonLoading,
} from '@ionic/react';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import Slider from 'rc-slider';
import { skillLevelMap } from '../scripts/consts';

import '../css/iondefaults.css';
import { chevronDown, chevronUp } from 'ionicons/icons';

const FindTab: React.FC = () => {
  const distanceOptions = ['Auto', '1 km', '5 km', '10 km', '50 km'];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeOptions = [
    '6-9',
    '9-12',
    '12-15',
    '15-18',
    '18-21',
    '21-24',
    '0-3',
    '3-6',
  ];

  const [state, setState] = useState({
    options: {
      activityPreferences: [],
      distance: 'Auto',
      timePreferences: daysOfWeek.reduce((obj, item) => {
        obj[item] = timeOptions.reduce((obj, item) => {
          obj[item] = false;
          return obj;
        }, {});
        return obj;
      }, {}),
    },
    selectedDay: daysOfWeek[0],
  });
  const profile = useSelector(state => state.firebase.profile);
  useFirestoreConnect([
    {
      collection: 'activitiesList',
    },
  ]);
  const activitiesList = useSelector(
    state => state.firestore.ordered.activitiesList
  );

  useEffect(() => {
    setState(state => {
      return {
        ...state,
        options: {
          ...state.options,
          activityPreferences: profile.activities.map(activity => {
            return {
              name: activity.name,
              displayName: activity.displayName,
              lowestActivitySkill:
                activity.activitySkillLevel > 0
                  ? activity.activitySkillLevel - 1
                  : 0,
              highestActivitySkill:
                activity.activitySkillLevel < 4
                  ? activity.activitySkillLevel + 1
                  : 4,
            };
          }),
        },
      };
    });
  }, [profile.activities]);

  const handleDayOnChange = day => {
    setState(state => {
      return {
        ...state,
        selectedDay: day,
      };
    });
  };

  const handleDistanceOnChange = distance => {
    setState(state => {
      return {
        ...state,
        options: {
          ...state.options,
          distance,
        },
      };
    });
  };

  return (
    <>
      <IonPage>
        {!activitiesList && <IonLoading translucent isOpen />}
        <IonContent>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle>
                <span
                  className="font-title"
                  style={{ fontWeight: 900, fontSize: '1.2rem' }}
                >
                  Squad
                </span>
              </IonTitle>
              <IonButtons slot="end"></IonButtons>
              <IonButtons slot="start"></IonButtons>
            </IonToolbar>
          </IonHeader>
          <div className="pt-6">
            <div className="pb-6 pl-4">
              <div className="text-black text-2xl font-bold">Activities</div>
              <div className="text-gray-500 mt-1">
                Activities and group skill level
              </div>
            </div>
            <IonList>
              {activitiesList ? (
                activitiesList
                  .slice()
                  .sort((a, b) => {
                    if (a.displayName > b.displayName) {
                      return 1;
                    } else if (a.displayName < b.displayName) {
                      return -1;
                    }
                    return 0;
                  })
                  .map(res => {
                    return (
                      <React.Fragment key={res.name}>
                        <ActivityPreferenceItem
                          res={res}
                          state={state}
                          setState={setState}
                          profile={profile}
                        />
                      </React.Fragment>
                    );
                  })
              ) : (
                <>No Results</>
              )}
            </IonList>
          </div>
          <div
            className="pt-8 pb-10"
            style={{ borderBottom: 'solid 1px #CCCCCC' }}
          >
            <div className="pb-6 pl-4">
              <div className="text-black text-2xl font-bold">Distance</div>
              <div className="text-gray-500 mt-1">
                Maximum distance of activity
              </div>
            </div>
            <div className="h-10 px-4 flex">
              {distanceOptions.map((segmentLabel, index) => (
                <div
                  key={segmentLabel}
                  className={
                    'flex-1 h-full w-full text-center flex ' +
                    (state.options.distance === segmentLabel
                      ? 'text-white font-bold bg-primary-700 '
                      : 'text-gray-700 font-normal bg-gray-100 ') +
                    (index === 0
                      ? 'rounded-l-lg'
                      : index === distanceOptions.length - 1
                      ? 'rounded-r-lg'
                      : '')
                  }
                  style={{ border: 'solid 1px white' }}
                  onClick={() => handleDistanceOnChange(segmentLabel)}
                >
                  <div className="m-auto">{segmentLabel}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="pt-8 pb-10"
            style={{ borderBottom: 'solid 1px #CCCCCC' }}
          >
            <div className="pb-6 pl-4">
              <div className="text-black text-2xl font-bold">Availability</div>
              <div className="text-gray-500 mt-1">
                Your preferred start time
              </div>
            </div>

            <div className="px-4">
              <div className="flex h-10 mt-2">
                {daysOfWeek.map((day, index) => {
                  return (
                    <div
                      key={day}
                      className={
                        'relative flex-1 h-full w-full text-center flex ' +
                        (state.selectedDay === day
                          ? 'text-white font-bold bg-primary-700 '
                          : 'text-gray-700 font-normal bg-gray-100 ') +
                        (index === 0
                          ? 'rounded-l-lg'
                          : index === daysOfWeek.length - 1
                          ? 'rounded-r-lg'
                          : '')
                      }
                      style={{ border: 'solid 1px white' }}
                      onClick={() => handleDayOnChange(day)}
                    >
                      <div className="m-auto">{day}</div>
                      {Object.values(state.options.timePreferences[day]).some(
                        item => item
                      ) && (
                        <div
                          className={
                            'absolute bottom-0 right-0 left-0 text-xl font-black ' +
                            (state.selectedDay === day
                              ? 'text-white'
                              : 'text-primary-700')
                          }
                        >
                          .
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6">
                <DayTimingPreferenceSelector
                  timeOptions={timeOptions}
                  state={state}
                  setState={setState}
                />
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

const DayTimingPreferenceSelector = props => {
  const { timeOptions, state, setState } = props;
  const nameMaps = {
    '6-9': 'Dawn',
    '9-12': 'Morning',
    '12-15': 'Noon',
    '15-18': 'Afternoon',
    '18-21': 'Evening',
    '21-24': 'Night',
    '0-3': 'Midnight',
    '3-6': 'Late',
  };

  const handleTimeSelectToggle = option => {
    setState(state => {
      return {
        ...state,
        options: {
          ...state.options,
          timePreferences: {
            ...state.options.timePreferences,
            [state.selectedDay]: {
              ...state.options.timePreferences[state.selectedDay],
              [option]: !state.options.timePreferences[state.selectedDay][
                option
              ],
            },
          },
        },
      };
    });
  };
  return (
    <div className="grid grid-flow-row grid-cols-4 grid-rows-2">
      {timeOptions.map((option, index) => {
        const optionSelected =
          state.options.timePreferences[state.selectedDay][option];
        return (
          <div
            key={option}
            className={
              'text-center flex flex-col py-4 ' +
              (optionSelected ? 'bg-primary-700 ' : 'bg-gray-50 ') +
              (index === 0
                ? 'rounded-tl-lg'
                : index === 3
                ? 'rounded-tr-lg'
                : index === 4
                ? 'rounded-bl-lg'
                : index === 7
                ? 'rounded-br-lg'
                : '')
            }
            style={{ border: 'solid 1px white' }}
            onClick={() => handleTimeSelectToggle(option)}
          >
            <div className="m-auto">
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 91 91"
                enableBackground="new 0 0 91 91"
                className={
                  'w-8 h-8 ' + (optionSelected ? 'text-white fill-current' : '')
                }
              >
                {(index === 0 || index === 4) && (
                  <g>
                    <path d="M45.5,32.4c2.2,0,4-1.8,4-4v-8.1c0-2.2-1.8-4-4-4s-4,1.8-4,4v8.1C41.5,30.7,43.3,32.4,45.5,32.4z" />
                    <path
                      d="M69,42c1,0,2-0.4,2.8-1.2l5.8-5.8c1.6-1.6,1.6-4.1,0-5.7c-1.6-1.6-4.1-1.6-5.7,0l-5.8,5.8c-1.6,1.6-1.6,4.1,0,5.7
               C67,41.6,68,42,69,42z"
                    />
                    <path
                      d="M19.2,40.8C19.9,41.6,21,42,22,42c1,0,2-0.4,2.8-1.2c1.6-1.6,1.6-4.1,0-5.7l-5.8-5.8c-1.6-1.6-4.1-1.6-5.7,0
               c-1.6,1.6-1.6,4.1,0,5.7L19.2,40.8z"
                    />
                    <path d="M86.9,66.7H4.1c-2.2,0-4,1.8-4,4s1.8,4,4,4h82.8c2.2,0,4-1.8,4-4S89.1,66.7,86.9,66.7z" />
                    <path
                      d="M27.1,60.8c2.1,0.6,4.3-0.7,4.9-2.9c1.6-6.2,7.2-10.5,13.6-10.5s12,4.3,13.6,10.5c0.5,1.8,2.1,3,3.9,3c0.3,0,0.7,0,1-0.1
               c2.1-0.6,3.4-2.7,2.9-4.9c-2.5-9.7-11.3-16.5-21.3-16.5c-10,0-18.8,6.8-21.3,16.5C23.6,58.1,24.9,60.3,27.1,60.8z"
                    />
                  </g>
                )}
                {(index === 1 || index === 3) && (
                  <g>
                    <path d="M45.5,26.3c2.2,0,4-1.8,4-4v-8.1c0-2.2-1.8-4-4-4s-4,1.8-4,4v8.1C41.5,24.5,43.3,26.3,45.5,26.3z" />
                    <path d="M74.8,55.6c0,2.2,1.8,4,4,4h8.1c2.2,0,4-1.8,4-4s-1.8-4-4-4h-8.1C76.5,51.6,74.8,53.4,74.8,55.6z" />
                    <path d="M4.1,59.6h8.1c2.2,0,4-1.8,4-4s-1.8-4-4-4H4.1c-2.2,0-4,1.8-4,4S1.9,59.6,4.1,59.6z" />
                    <path
                      d="M69,36.1c1,0,2-0.4,2.8-1.2l5.8-5.8c1.6-1.6,1.6-4.1,0-5.7c-1.6-1.6-4.1-1.6-5.7,0l-5.8,5.8c-1.6,1.6-1.6,4.1,0,5.7
                   C67,35.7,68,36.1,69,36.1z"
                    />
                    <path
                      d="M19.2,34.9c0.8,0.8,1.8,1.2,2.8,1.2c1,0,2-0.4,2.8-1.2c1.6-1.6,1.6-4.1,0-5.7l-5.8-5.8c-1.6-1.6-4.1-1.6-5.7,0
                   c-1.6,1.6-1.6,4.1,0,5.7L19.2,34.9z"
                    />
                    <path
                      d="M25.5,64.7c0.9,2,3.3,2.9,5.3,2c2-0.9,2.9-3.3,2-5.3c-0.8-1.8-1.3-3.8-1.3-5.8c0-7.7,6.3-14,14-14s14,6.3,14,14
                   c0,2-0.4,4-1.3,5.8c-0.9,2,0,4.4,2,5.3c0.5,0.2,1.1,0.4,1.7,0.4c1.5,0,3-0.9,3.6-2.3c1.3-2.9,2-6,2-9.1c0-12.1-9.9-22-22-22
                   c-12.1,0-22,9.9-22,22C23.5,58.8,24.2,61.8,25.5,64.7z"
                    />
                    <path d="M86.9,72.8H4.1c-2.2,0-4,1.8-4,4s1.8,4,4,4h82.8c2.2,0,4-1.8,4-4S89.1,72.8,86.9,72.8z" />
                  </g>
                )}
                {index === 2 && (
                  <g>
                    <path
                      d="M45.5,23.5c-12.1,0-22,9.9-22,22c0,12.1,9.9,22,22,22c12.1,0,22-9.9,22-22C67.5,33.4,57.6,23.5,45.5,23.5z M45.5,59.5
                    c-7.7,0-14-6.3-14-14c0-7.7,6.3-14,14-14c7.7,0,14,6.3,14,14C59.5,53.2,53.2,59.5,45.5,59.5z"
                    />
                    <path d="M45.5,16.2c2.2,0,4-1.8,4-4V4.1c0-2.2-1.8-4-4-4c-2.2,0-4,1.8-4,4v8.1C41.5,14.5,43.3,16.2,45.5,16.2z" />
                    <path d="M86.9,41.5h-8.1c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4h8.1c2.2,0,4-1.8,4-4C90.9,43.3,89.1,41.5,86.9,41.5z" />
                    <path d="M45.5,74.8c-2.2,0-4,1.8-4,4v8.1c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4v-8.1C49.5,76.5,47.7,74.8,45.5,74.8z" />
                    <path d="M16.2,45.5c0-2.2-1.8-4-4-4H4.1c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4h8.1C14.5,49.5,16.2,47.7,16.2,45.5z" />
                    <path
                      d="M69,26c1,0,2-0.4,2.8-1.2l5.8-5.8c1.6-1.6,1.6-4.1,0-5.7c-1.6-1.6-4.1-1.6-5.7,0l-5.8,5.8c-1.6,1.6-1.6,4.1,0,5.7
                    C67,25.6,68,26,69,26z"
                    />
                    <path
                      d="M71.8,66.2c-1.6-1.6-4.1-1.6-5.7,0c-1.6,1.6-1.6,4.1,0,5.7l5.8,5.8c0.8,0.8,1.8,1.2,2.8,1.2c1,0,2-0.4,2.8-1.2
                    c1.6-1.6,1.6-4.1,0-5.7L71.8,66.2z"
                    />
                    <path
                      d="M19.2,66.2l-5.8,5.8c-1.6,1.6-1.6,4.1,0,5.7c0.8,0.8,1.8,1.2,2.8,1.2c1,0,2-0.4,2.8-1.2l5.8-5.8c1.6-1.6,1.6-4.1,0-5.7
                    C23.3,64.6,20.7,64.6,19.2,66.2z"
                    />
                    <path
                      d="M19.2,24.8C19.9,25.6,21,26,22,26c1,0,2-0.4,2.8-1.2c1.6-1.6,1.6-4.1,0-5.7l-5.8-5.8c-1.6-1.6-4.1-1.6-5.7,0
                    c-1.6,1.6-1.6,4.1,0,5.7L19.2,24.8z"
                    />
                  </g>
                )}
                {(index === 5 || index === 7) && (
                  <path
                    d="M47.9,76.5C36.8,76.5,26.5,70.5,21,61c-4.1-7.2-5.2-15.5-3.1-23.5c2.1-8,7.3-14.7,14.4-18.8c4.1-2.4,8.6-3.7,13.3-4.1
                  c1.7-0.1,3.3,0.9,4,2.4c0.7,1.6,0.3,3.4-1,4.5c-7.3,6.6-9.1,17.5-4.2,26c3.7,6.4,10.6,10.4,18.1,10.4c2.2,0,4.4-0.4,6.5-1
                  c1.6-0.5,3.4,0,4.4,1.4c1,1.4,1.1,3.2,0.1,4.7c-2.6,3.9-6.1,7.1-10.2,9.5C58.6,75,53.3,76.5,47.9,76.5z M35.9,25.8
                  c-5.1,3.1-8.7,7.9-10.3,13.7C24,45.4,24.8,51.6,27.9,57c4.1,7.1,11.7,11.5,19.9,11.5c3.8,0,7.6-1,11-2.8
                  c-8.9-1.1-16.9-6.3-21.5-14.2C32.8,43.5,32.4,34,35.9,25.8z"
                  />
                )}
                {index === 6 && (
                  <g>
                    <path
                      d="M60.1,56.8c-2.1,0.7-4.3,1-6.5,1c-7.5,0-14.4-4-18.1-10.4c-4.9-8.5-3.1-19.4,4.2-26c1.3-1.1,1.7-3,1-4.5
            c-0.7-1.6-2.3-2.6-4-2.4c-4.7,0.3-9.2,1.7-13.3,4.1C8.7,27.2,3.6,46.2,12.2,61C17.7,70.5,28,76.5,39,76.5c5.4,0,10.8-1.4,15.5-4.2
            c4.1-2.4,7.5-5.5,10.2-9.5c1-1.4,0.9-3.3-0.1-4.7C63.5,56.8,61.7,56.3,60.1,56.8z M39,68.5c-8.2,0-15.8-4.4-19.9-11.5
            c-6.3-10.8-2.7-24.7,8-31.2C23.6,34,24,43.5,28.6,51.5c4.5,7.8,12.5,13.1,21.5,14.2C46.7,67.5,42.9,68.5,39,68.5z"
                    />
                    <path
                      d="M52,41.7c0.9,0,1.8-0.4,2.5-1c0.7-0.6,1-1.5,1-2.5c0-0.9-0.4-1.8-1-2.5c-1.3-1.3-3.6-1.3-4.9,0c-0.7,0.6-1,1.6-1,2.5
            c0,0.9,0.4,1.8,1,2.5C50.2,41.3,51.1,41.7,52,41.7z"
                    />
                    <path
                      d="M66,15.7c-1.2,0-2.3,0.5-3.2,1.3c-0.8,0.8-1.3,2-1.3,3.2c0,1.2,0.5,2.3,1.3,3.2c0.8,0.8,2,1.3,3.2,1.3
            c1.2,0,2.3-0.5,3.2-1.3c0.8-0.8,1.3-2,1.3-3.2c0-1.2-0.5-2.3-1.3-3.2C68.3,16.2,67.2,15.7,66,15.7z"
                    />
                    <path
                      d="M81.8,41.4c-0.7-0.7-1.8-1.2-2.8-1.2c-1,0-2.1,0.4-2.8,1.2c-0.7,0.7-1.2,1.8-1.2,2.8c0,1,0.4,2.1,1.2,2.8
            c0.8,0.7,1.8,1.2,2.8,1.2c1,0,2.1-0.4,2.8-1.2c0.8-0.8,1.2-1.8,1.2-2.8C83,43.2,82.6,42.1,81.8,41.4z"
                    />
                  </g>
                )}
              </svg>

              <div
                className={
                  'font-semibold mt-1 ' +
                  (optionSelected ? 'text-white' : 'text-gray-700')
                }
              >
                {option}
              </div>
              <div
                className={
                  'text-sm ' + (optionSelected ? 'text-white' : 'text-gray-500')
                }
              >
                {nameMaps[option]}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ActivityPreferenceItem = props => {
  const { res, state, setState, profile } = props;
  const [itemState, setItemState] = useState({
    editOpened: false,
  });
  const profileActivitySelection = state.options.activityPreferences.filter(
    activity => activity.name === res.name
  );
  const isSelected = !!profileActivitySelection.length;
  const profileActivity = isSelected ? profileActivitySelection[0] : null;

  const handleToggle = () => {
    setState(state => {
      if (isSelected) {
        return {
          ...state,
          options: {
            ...state.options,
            activityPreferences: state.options.activityPreferences.filter(
              item => item.name !== res.name
            ),
          },
        };
      } else if (
        profile.activities.map(activity => activity.name).includes(res.name)
      ) {
        const profileActivity = profile.activities.filter(
          activity => activity.name === res.name
        )[0];
        return {
          ...state,
          options: {
            ...state.options,
            activityPreferences: [
              ...state.options.activityPreferences,
              {
                name: profileActivity.name,
                displayName: profileActivity.displayName,
                lowestActivitySkill:
                  profileActivity.activitySkillLevel > 0
                    ? profileActivity.activitySkillLevel - 1
                    : 0,
                highestActivitySkill:
                  profileActivity.activitySkillLevel < 4
                    ? profileActivity.activitySkillLevel + 1
                    : 4,
              },
            ],
          },
        };
      }

      return {
        ...state,
        options: {
          ...state.options,
          activityPreferences: [
            ...state.options.activityPreferences,
            {
              name: res.name,
              displayName: res.displayName,
              lowestActivitySkill: 0,
              highestActivitySkill: 2,
            },
          ],
        },
      };
    });
  };

  const handleSkillLevelSliderOnChange = value => {
    setState(state => {
      return {
        ...state,
        options: {
          ...state.options,
          activityPreferences: [
            ...state.options.activityPreferences.filter(
              item => item.name !== res.name
            ),
            {
              name: res.name,
              displayName: res.displayName,
              lowestActivitySkill: value[0],
              highestActivitySkill: value[1],
            },
          ],
        },
      };
    });
  };

  const toggleEditOpened = () => {
    setItemState(itemState => {
      return {
        ...itemState,
        editOpened: !itemState.editOpened,
      };
    });
  };

  return (
    <div
      className={'px-4 ' + (isSelected ? 'pt-4 pb-2' : 'py-1')}
      style={{ borderBottom: 'solid 1px #CCCCCC' }}
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <div>
            <div className="text-lg w-full font-medium">{res.displayName}</div>

            {isSelected && (
              <div
                className="flex items-center text-gray-500 h-6"
                onClick={toggleEditOpened}
              >
                {!itemState.editOpened ? (
                  <>
                    <IonIcon icon={chevronDown} />
                    <span className="font-medium text-gray-500 my-1 ml-1">
                      {profileActivity.lowestActivitySkill !==
                      profileActivity.highestActivitySkill ? (
                        <>
                          {skillLevelMap[profileActivity.lowestActivitySkill]} -{' '}
                          {skillLevelMap[profileActivity.highestActivitySkill]}
                        </>
                      ) : (
                        <>
                          {skillLevelMap[profileActivity.lowestActivitySkill]}
                        </>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <IonIcon icon={chevronUp} />
                    <span className="font-medium text-gray-500 my-1 ml-1">
                      Close
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex-1"></div>
          <div className="flex h-full">
            <IonToggle
              color="primary"
              className="m-auto"
              checked={isSelected}
              onIonChange={handleToggle}
            />
          </div>
        </div>

        {isSelected && itemState.editOpened && (
          <div className="mt-2 mb-2 w-3/4 bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">
                Preferred group skill level:
              </span>
              <br />
              <span className="font-semibold text-gray-700 mt-1">
                {profileActivity.lowestActivitySkill !==
                profileActivity.highestActivitySkill ? (
                  <>
                    {skillLevelMap[profileActivity.lowestActivitySkill]} -{' '}
                    {skillLevelMap[profileActivity.highestActivitySkill]}
                  </>
                ) : (
                  <>{skillLevelMap[profileActivity.lowestActivitySkill]}</>
                )}
              </span>
            </div>
            <div className="px-2 mt-3">
              <Slider.Range
                min={0}
                max={4}
                step={1}
                dots
                value={[
                  profileActivity.lowestActivitySkill,
                  profileActivity.highestActivitySkill,
                ]}
                allowCross={false}
                onChange={handleSkillLevelSliderOnChange}
              />
            </div>
            <div>
              <button
                className="mt-5 py-3 flex-1 font-medium text-white flex rounded px-4 bg-primary-700 no-underline"
                onClick={toggleEditOpened}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindTab;
