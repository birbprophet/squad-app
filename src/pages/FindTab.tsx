import React, { useState, useEffect } from 'react';
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
  IonGrid,
  IonRow,
  IonIcon,
  IonList,
  IonListHeader,
  IonItem,
  IonToggle,
} from '@ionic/react';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import Slider from 'rc-slider';
import colorScheme from '../colorScheme';
import { skillLevelMap } from '../scripts/consts';

import '../css/iondefaults.css';

const FindTab: React.FC = () => {
  const [state, setState] = useState({
    options: {
      activityPreferences: [],
    },
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

  return (
    <>
      <IonPage>
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
          <div className="pt-4">
            <IonList>
              <IonListHeader className="pb-4">Activities</IonListHeader>
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
        </IonContent>
      </IonPage>
    </>
  );
};

const ActivityPreferenceItem = props => {
  const { res, state, setState, profile } = props;
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

  return (
    <div
      className={'px-4 ' + (isSelected ? 'pt-4 pb-2' : 'py-1')}
      style={{ borderBottom: 'solid 1px #CCCCCC' }}
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="font-medium text-lg w-full">{res.displayName}</div>
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

        {isSelected && (
          <div className="mt-4 mb-2 w-3/4 bg-gray-50 p-4 rounded-lg">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default FindTab;
