import React, { useState, useEffect, useCallback } from 'react';
import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonList,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonReorderGroup,
  IonReorder,
  IonChip,
  IonDatetime,
} from '@ionic/react';
import { useSelector } from 'react-redux';
import { ItemReorderEventDetail } from '@ionic/core';
import {
  isLoaded,
  isEmpty,
  useFirestoreConnect,
  useFirebase,
} from 'react-redux-firebase';
import { useCamera } from '@ionic/react-hooks/camera';
import { useCurrentPosition } from '@ionic/react-hooks/geolocation';
import { useGetInfo } from '@ionic/react-hooks/device';

import { CameraResultType } from '@capacitor/core';

import algoliasearch from 'algoliasearch/lite';

import Div100vh from 'react-div-100vh';
import Slider from 'rc-slider';
import colorScheme from '../colorScheme';
import firebaseApp from 'firebase/app';

import { getInvalidUsernameMessage } from '../scripts/getInvalidUsernameMessage';
import { addCircleOutline, closeCircle, chevronBack } from 'ionicons/icons';

import { skillLevelMap } from '../scripts/consts';

const geoCode = firebaseApp.functions().httpsCallable('geoCode');

const WelcomePage: React.FC = () => {
  const [state, setState] = useState({
    phase: 2,
    userDetails: {
      firstName: '',
      lastName: '',
      birthday: null,
      gender: null,
      username: '',
      profilePictureUrl: null,
      profilePictureUrls: null,
      location: null,
    },
    userActivities: [],
    populatedUserActivities: [],
    currentPosition: null,
  });
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

  const isLoading = !isLoaded(auth) || !isLoaded(profile);
  const isLoggedIn = !isLoading && !isEmpty(auth);
  const isRegisteredUser = isLoggedIn && !isEmpty(profile);
  const profileComplete = isRegisteredUser && !!profile?.activities.length;
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

  useEffect(() => {
    if (isRegisteredUser && !profileComplete) {
      setState(state => {
        return { ...state, phase: 3 };
      });
    }
  }, [isRegisteredUser, profileComplete]);

  useEffect(() => {
    if (isLoaded(auth) && !isEmpty(auth) && auth?.displayName) {
      const splitName: string[] = auth.displayName.split(' ');

      const firstName = splitName.slice(0, splitName.length - 1).join(' ');
      const lastName = splitName[splitName.length - 1];
      setState(state => {
        return {
          ...state,
          userDetails: { ...state.userDetails, firstName, lastName },
        };
      });
    }
  }, [auth]);

  return (
    <IonPage>
      <IonContent>
        {state.phase === 1 && (
          <PhaseOneScreen
            state={state}
            setState={setState}
            getPosition={getPosition}
          />
        )}
        {state.phase === 2 && (
          <PhaseTwoScreen state={state} setState={setState} auth={auth} />
        )}
        {state.phase === 3 && (
          <PhaseThreeScreen state={state} setState={setState} />
        )}
        {state.phase === 4 && (
          <PhaseFourScreen state={state} setState={setState} />
        )}
        {state.phase === 5 && (
          <PhaseFiveScreen state={state} profile={profile} />
        )}
      </IonContent>
    </IonPage>
  );
};

const PhaseFiveScreen = props => {
  const { profile, state } = props;
  const firebase = useFirebase();
  const [phaseState, setPhaseState] = useState({
    uploadingActivities: false,
  });

  const handleCompleteOnClick = () => {
    setPhaseState({
      ...phaseState,
      uploadingActivities: true,
    });
  };

  useEffect(() => {
    if (phaseState.uploadingActivities) {
      firebase.updateProfile({
        activities: state.populatedUserActivities,
      });
    }
  }, [phaseState.uploadingActivities, firebase, state.populatedUserActivities]);

  return (
    <Div100vh>
      <div className="w-full h-full py-8 px-6 flex flex-col">
        <div className="text-5xl font-normal text-gray-500">
          We're all set, it's time to
          <br />
          <span className="font-medium text-black">find a squad!</span>
        </div>
        <div className="text-xl text-gray-700 mt-4">
          You can edit your profile anytime
        </div>
        <div className="flex-1 flex">
          <IonCard className="my-auto w-full px-1/12 ion-no-padding">
            <div className="flex px-6 py-6 items-center">
              <img
                src={profile.profilePictureUrl}
                alt=""
                className="w-20 h-20 rounded-full"
              />
              <div className="ml-4">
                <div className="text-lg font-medium text-gray-500">
                  @{profile.username}
                </div>
                <div className="text-2xl font-bold text-black mt-1">
                  {profile.firstName}
                </div>
                <div className="mt-2">
                  {state.populatedUserActivities[0].displayName} -{' '}
                  {
                    skillLevelMap[
                      state.populatedUserActivities[0].activitySkillLevel
                    ]
                  }
                </div>
              </div>
            </div>
          </IonCard>
        </div>
        <div className="flex pt-8">
          <button
            className="h-14 flex-1 text-lg font-medium text-white flex rounded mx-2 bg-primary-800"
            onClick={handleCompleteOnClick}
          >
            <div className="mx-auto flex items-center">
              <div className="font-medium">
                {phaseState.uploadingActivities ? (
                  <IonSpinner color="white" />
                ) : (
                  <>Complete</>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </Div100vh>
  );
};

const ActivityItemCard = props => {
  const { activity, setState, state } = props;
  const [cardState, setCardState] = useState({
    searchMode: false,
    searchQuery: '',
    searchResults: null,
    querySearched: false,
    addedSubActivity: null,
  });

  const algoliaClient = algoliasearch(
    'RAU64CI768',
    '432ad4e209285e54004976997bcaa628'
  );
  const subActivitiesIndex = algoliaClient.initIndex('subActivitiesList');

  useEffect(() => {
    if (!cardState.querySearched) {
      subActivitiesIndex
        .search(cardState.searchQuery, {
          filters: `parentName:${activity.name}`,
        })
        .then(({ hits }) => {
          setCardState(cardState => {
            return {
              ...cardState,
              searchResults: hits,
              querySearched: true,
            };
          });
        });
    }
  }, [
    activity.name,
    subActivitiesIndex,
    setCardState,
    cardState.searchQuery,
    cardState.querySearched,
  ]);

  const handleActivitySearchOnChange = e => {
    setCardState({
      ...cardState,
      searchQuery: e.target.value,
      querySearched: false,
    });
  };

  const alterActivity = newActivity => {
    setState(state => {
      return {
        ...state,
        populatedUserActivities: state.populatedUserActivities.map(item => {
          if (item.name === newActivity.name) {
            return newActivity;
          } else {
            return item;
          }
        }),
      };
    });
  };

  if (
    state.populatedUserActivities[0].name === activity.name &&
    !activity.isMainActivity
  ) {
    alterActivity({ ...activity, isMainActivity: true });
  } else if (
    state.populatedUserActivities[0].name !== activity.name &&
    activity.isMainActivity
  ) {
    alterActivity({ ...activity, isMainActivity: false });
  }

  useEffect(() => {
    if (cardState.addedSubActivity) {
      if (
        activity.subActivities
          .map(item => item.name)
          .includes(cardState.addedSubActivity.name)
      ) {
        setCardState(cardState => {
          return {
            ...cardState,
            addedSubActivity: null,
          };
        });
      } else {
        setState(state => {
          return {
            ...state,
            populatedUserActivities: state.populatedUserActivities.map(item => {
              if (item.name === activity.name) {
                return {
                  ...activity,
                  subActivities: [
                    ...activity.subActivities,
                    cardState.addedSubActivity,
                  ],
                };
              } else {
                return item;
              }
            }),
          };
        });
      }
    }
  }, [cardState.addedSubActivity, activity, setState]);

  const handleSkillLevelOnChange = value => {
    alterActivity({ ...activity, activitySkillLevel: value });
  };

  const handleToggleSearchOpen = () => {
    setCardState({ ...cardState, searchMode: !cardState.searchMode });
  };

  const handleSubActivityOnSelect = subactivityItem => {
    const { name, displayName } = subactivityItem;
    if (!activity.subActivities.map(item => item.name).includes(name)) {
      setCardState({
        ...cardState,
        addedSubActivity: { name, displayName },
        searchMode: false,
        searchQuery: '',
        querySearched: false,
      });
    }
  };

  const handleSubActivityOnDelete = subactivity => {
    const { name } = subactivity;
    alterActivity({
      ...activity,
      subActivities: activity.subActivities.filter(item => item.name !== name),
    });
  };

  return (
    <IonCard className="w-full">
      <IonCardHeader className="flex">
        <div className="flex-1">
          <IonCardSubtitle>
            {activity.isMainActivity ? 'Main activity' : 'Activity'}
          </IonCardSubtitle>
          <IonCardTitle className="w-full flex">
            {activity.displayName}
          </IonCardTitle>
        </div>
        <IonReorder />
      </IonCardHeader>

      <IonCardContent>
        <div>
          Experience:{' '}
          <span className="font-bold">
            {skillLevelMap[activity.activitySkillLevel]}
          </span>
        </div>
        <div className="my-4">
          <Slider
            dots
            min={0}
            max={4}
            step={1}
            value={activity.activitySkillLevel}
            defaultValue={2}
            onChange={handleSkillLevelOnChange}
            railStyle={{ borderColor: colorScheme['primary-700'] }}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded mt-8">
          {cardState.searchMode ? (
            <>
              <div className="flex flex-col max-h-1/3">
                <div
                  className="text-gray-500 text-sm flex items-center"
                  onClick={handleToggleSearchOpen}
                >
                  <IonIcon icon={chevronBack} /> Back
                </div>
                <div className="w-full">
                  <IonSearchbar
                    placeholder="Find subactivities"
                    onIonChange={handleActivitySearchOnChange}
                    value={cardState.searchQuery}
                    className="ion-no-padding"
                  ></IonSearchbar>
                </div>

                <div className="h-full overflow-y-scroll overflow-x-hidden">
                  {cardState.searchResults &&
                    cardState.searchResults.map(res => {
                      if (
                        activity.subActivities
                          .map(item => item.name)
                          .includes(res.name)
                      ) {
                        return <React.Fragment key={res.name}></React.Fragment>;
                      }

                      return (
                        <div key={res.name}>
                          <IonItem
                            className="ion-no-padding"
                            color="transparent"
                            onClick={() => handleSubActivityOnSelect(res)}
                          >
                            <IonLabel>{res.displayName}</IonLabel>
                          </IonItem>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <div className="font-medium text-lg text-gray-700 flex-1 ml-2">
                  Subactivities
                </div>
                <IonChip onClick={handleToggleSearchOpen}>
                  <IonIcon icon={addCircleOutline} />
                  <IonLabel>Add</IonLabel>
                </IonChip>
              </div>

              {!!activity.subActivities.length && (
                <div className="mt-4">
                  {activity.subActivities.map(subactivity => {
                    return (
                      <IonChip color="primary" key={subactivity.displayName}>
                        <IonLabel color="primary">
                          {subactivity.displayName}
                        </IonLabel>
                        <IonIcon
                          icon={closeCircle}
                          onClick={() => handleSubActivityOnDelete(subactivity)}
                        />
                      </IonChip>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

const PhaseFourScreen = props => {
  const { state, setState } = props;

  useEffect(() => {
    if (
      JSON.stringify(
        state.populatedUserActivities.map(item => item.name).sort()
      ) !== JSON.stringify(state.userActivities.map(item => item.name).sort())
    ) {
      const newPopulatedUserActivities = state.userActivities.map(
        ({ name, displayName }) => {
          if (
            !state.populatedUserActivities.map(item => item.name).includes(name)
          ) {
            return {
              name,
              displayName,
              activitySkillLevel: 2,
              subActivities: [],
              isMainActivity: false,
            };
          } else {
            const existingElementFiltered = state.populatedUserActivities.filter(
              element => element.name === name
            );
            return existingElementFiltered[0];
          }
        }
      );

      setState(state => {
        return {
          ...state,
          populatedUserActivities: newPopulatedUserActivities,
        };
      });
    }
  }, [state.userActivities, state.populatedUserActivities, setState]);

  const handleBackOnClick = () =>
    setState({
      ...state,
      phase: 3,
    });

  const handleNextOnClick = () => {
    setState({
      ...state,
      phase: 5,
    });
  };

  const doReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
    setState(state => {
      return {
        ...state,
        populatedUserActivities: event.detail.complete(
          state.populatedUserActivities
        ),
      };
    });
  };

  return (
    <Div100vh>
      <div className="w-full h-full py-8 px-6 flex flex-col">
        <div className="flex-1 flex flex-col h-full">
          <div className="flex-1 overflow-y-scroll overflow-x-hidden">
            <IonList>
              <IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
                {state.populatedUserActivities.map(activity => {
                  return (
                    <IonItem
                      lines="none"
                      className="ion-no-margin ion-no-padding"
                      key={activity.name}
                    >
                      <ActivityItemCard
                        activity={activity}
                        setState={setState}
                        state={state}
                      />
                    </IonItem>
                  );
                })}
              </IonReorderGroup>
            </IonList>
          </div>
        </div>
        <div className="flex pt-8">
          <button
            className="h-14 flex-1 text-lg font-medium text-primary-700 flex rounded bg-primary-200 mx-2"
            onClick={handleBackOnClick}
          >
            <div className="mx-auto flex items-center">
              <div className="font-medium">Back</div>
            </div>
          </button>
          <button
            className="h-14 flex-1 text-lg font-medium text-white flex rounded mx-2 bg-primary-800"
            onClick={handleNextOnClick}
          >
            <div className="mx-auto flex items-center">
              <div className="font-medium">Next</div>
            </div>
          </button>
        </div>
      </div>
    </Div100vh>
  );
};

const PhaseThreeScreen = props => {
  const { state, setState } = props;
  const [phaseState, setPhaseState] = useState({
    activityQuery: '',
    activityResults: null,
    querySearched: false,
  });

  const algoliaClient = algoliasearch(
    'RAU64CI768',
    '432ad4e209285e54004976997bcaa628'
  );
  const activitiesIndex = algoliaClient.initIndex('activitiesList');

  useEffect(() => {
    if (!phaseState.querySearched) {
      activitiesIndex.search(phaseState.activityQuery).then(({ hits }) => {
        setPhaseState(phaseState => {
          return {
            ...phaseState,
            activityResults: hits,
            querySearched: true,
          };
        });
      });
    }
  }, [
    activitiesIndex,
    setPhaseState,
    phaseState.activityQuery,
    phaseState.querySearched,
  ]);

  const handleActivitySearchOnChange = e => {
    setPhaseState({
      ...phaseState,
      activityQuery: e.target.value,
      querySearched: false,
    });
  };

  const handleCheckboxOnChange = e => {
    const [name, displayName] = e.detail.value.split('__');

    const checkboxChecked = state.userActivities
      .map(item => item.name)
      .includes(name);

    if (!checkboxChecked) {
      setState(state => {
        return {
          ...state,
          userActivities: [...state.userActivities, { name, displayName }],
        };
      });
    } else {
      setState(state => {
        return {
          ...state,
          userActivities: state.userActivities.filter(
            item => item.name !== name
          ),
        };
      });
    }
  };

  const phaseValid = state.userActivities && !!state.userActivities.length;

  const handleNextOnClick = () => {
    if (phaseValid) {
      setState({
        ...state,
        phase: 4,
      });
    }
  };

  return (
    <Div100vh>
      <div className="w-full h-full py-8 px-6 flex flex-col">
        <div className="text-5xl font-normal text-gray-500">
          And what are your favourite
          <br />
          <span className="font-medium text-black">activities?</span>
        </div>
        <div className="text-xl text-gray-700 mt-4">
          Let's start by picking at least one
        </div>
        <div className="flex-1 flex flex-col pt-8 h-full">
          <IonSearchbar
            showCancelButton="focus"
            placeholder="Search for an activity"
            onIonChange={handleActivitySearchOnChange}
            value={phaseState.activityQuery}
            className="ion-no-padding"
          ></IonSearchbar>
          <div className="h-full overflow-y-scroll overflow-x-hidden">
            {phaseState.activityResults &&
              phaseState.activityResults.map(res => {
                return (
                  <div key={res.name}>
                    <IonItem className="ion-no-padding">
                      <IonLabel>{res.displayName}</IonLabel>
                      <IonCheckbox
                        slot="start"
                        value={res.name + '__' + res.displayName}
                        checked={state.userActivities
                          .map(item => item.name)
                          .includes(res.name)}
                        onIonChange={handleCheckboxOnChange}
                      />
                    </IonItem>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="flex pt-8">
          <button
            className={
              'h-14 flex-1 text-lg font-medium text-white flex rounded mx-2 ' +
              (phaseValid ? 'bg-primary-800' : 'bg-gray-300')
            }
            onClick={handleNextOnClick}
          >
            <div className="mx-auto flex items-center">
              <div className="font-medium">Next</div>
            </div>
          </button>
        </div>
      </div>
    </Div100vh>
  );
};

const PhaseTwoScreen = props => {
  const { state, setState, auth } = props;
  const firebase = useFirebase();
  const [phaseState, setPhaseState] = useState({
    usernameErrorMessage: '',
    photoUploading: false,
  });
  const { photo, getPhoto } = useCamera();
  const { info } = useGetInfo();
  useFirestoreConnect([
    {
      collection: 'userProfilePictures',
      doc: auth.uid,
    },
  ]);
  useFirestoreConnect([{ collection: 'users' }]);
  const users = useSelector(state => state.firestore.ordered.users);

  const userProfilePictureDoc = useSelector(
    ({ firestore: { data } }) =>
      data.userProfilePictures && data.userProfilePictures[auth.uid]
  );

  useEffect(() => {
    if (
      userProfilePictureDoc?.profilePictureUrls?.size_200 &&
      state.userDetails.profilePictureUrl
    ) {
      setState(state => {
        return {
          ...state,
          userDetails: {
            ...state.userDetails,
            profilePictureUrl:
              userProfilePictureDoc.profilePictureUrls.size_200,
            profilePictureUrls: userProfilePictureDoc.profilePictureUrls,
          },
        };
      });
    }
  }, [userProfilePictureDoc, state.userDetails.profilePictureUrl, setState]);

  useEffect(() => {
    if (
      state.userDetails.username !== '' &&
      state.userDetails.username.charAt(0) !== '@'
    ) {
      setState(state => {
        return {
          ...state,
          userDetails: {
            ...state.userDetails,
            username: '@' + state.userDetails.username,
          },
        };
      });
    }
  }, [state.userDetails.username, setState]);

  const triggerCamera = useCallback(async () => {
    getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });
  }, [getPhoto]);

  useEffect(() => {
    let errorMessage = getInvalidUsernameMessage(state.userDetails.username);
    const cleanedUsername = state.userDetails.username.replace('@', '');
    if (!errorMessage.length && cleanedUsername !== '') {
      if (users.map(user => user.username).includes(cleanedUsername)) {
        errorMessage = `Username @${cleanedUsername} is already taken`;
      }
    }

    if (phaseState.usernameErrorMessage !== errorMessage) {
      setPhaseState(phaseState => {
        return {
          ...phaseState,
          usernameErrorMessage: errorMessage,
        };
      });
    }
  }, [state.userDetails.username, phaseState.usernameErrorMessage, users]);

  useEffect(() => {
    const uploadPicture = async imageString => {
      const storageRef = firebase
        .storage()
        .ref(`/userProfilePictures/${auth.uid}.jpg`);

      await storageRef.putString(imageString, 'base64', {
        contentType: 'image/jpeg',
      });

      const imageDownloadUrl = await storageRef.getDownloadURL();

      return imageDownloadUrl;
    };

    if (phaseState.photoUploading && photo?.base64String) {
      uploadPicture(photo.base64String).then(imageDownloadUrl =>
        setState(state => {
          return {
            ...state,
            userDetails: {
              ...state.userDetails,
              profilePictureUrl: imageDownloadUrl,
            },
          };
        })
      );
    }
  }, [photo, phaseState.photoUploading, auth.uid, setState, firebase]);

  useEffect(() => {
    if (state.userDetails.profilePictureUrl && phaseState.photoUploading) {
      setPhaseState(phaseState => {
        return { ...phaseState, photoUploading: false };
      });
    }
  }, [state.userDetails.profilePictureUrl, phaseState.photoUploading]);

  const phaseValid =
    !phaseState.usernameErrorMessage.length &&
    !!state.userDetails.username.length &&
    !!state.userDetails.profilePictureUrl?.length;

  const handleProfilePictureClick = async () => {
    await triggerCamera();
    setPhaseState({ ...phaseState, photoUploading: true });
  };

  const handleProfilePictureReuploadClick = async () => {
    await triggerCamera();
    setPhaseState({
      ...phaseState,
      photoUploading: true,
    });
  };

  const handleUsernameOnChange = e =>
    setState({
      ...state,
      userDetails: { ...state.userDetails, username: e.target.value },
    });

  const handleBackOnClick = () =>
    setState({
      ...state,
      phase: 1,
    });

  const handleNextOnClick = () => {
    if (phaseValid) {
      firebase.updateProfile({
        ...state.userDetails,
        username: state.userDetails.username.slice(1),
        joined: new Date(),
        activities: [],
      });
      setState({
        ...state,
        phase: 3,
      });
    }
  };

  const handleImageUploaded = async e => {
    if (!!e.target.files.length) {
      const imageFile = e.target.files[0];
      const storageRef = firebase
        .storage()
        .ref(
          `/userProfilePictures/${auth.uid}.${
            imageFile.name.split('.').slice(-1)[0]
          }`
        );
      await storageRef.put(imageFile);
      const imageDownloadUrl = await storageRef.getDownloadURL();
      setState(state => {
        return {
          ...state,
          userDetails: {
            ...state.userDetails,
            profilePictureUrl: imageDownloadUrl,
          },
        };
      });
    }
  };

  return (
    <Div100vh>
      <div className="w-full h-full py-8 px-6 flex flex-col">
        <div className="text-5xl font-normal text-gray-500">
          It's nice to
          <br />
          meet you,
          <br />
          <span className="font-medium text-black">
            {state.userDetails.firstName}
          </span>
        </div>
        <div className="text-xl text-gray-700 mt-4">
          Let's pick a photo and username
        </div>
        <div className="flex-1 flex">
          <div className="m-auto w-full">
            <div className="w-full flex">
              {info?.platform === 'web' ? (
                <>
                  {state.userDetails.profilePictureUrl &&
                  !phaseState.photoUploading ? (
                    <img
                      src={state.userDetails.profilePictureUrl}
                      alt="profile"
                      className="m-auto rounded-full h-24 w-24 flex focus:outline-none"
                    />
                  ) : (
                    <div className="m-auto bg-primary-200 rounded-full h-24 w-24 flex focus:outline-none relative">
                      <input
                        type="file"
                        accept="image/jpeg"
                        className="bg-gray-200 rounded-full h-24 w-24 flex focus:outline-none absolute z-10 opacity-0"
                        onChange={handleImageUploaded}
                      ></input>
                      {phaseState.photoUploading ? (
                        <div className="m-auto">
                          <IonSpinner color="primary" />
                        </div>
                      ) : (
                        <div className="m-auto text-5xl font-bold text-white">
                          +
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {state.userDetails.profilePictureUrl &&
                  !phaseState.photoUploading ? (
                    <img
                      src={state.userDetails.profilePictureUrl}
                      alt="profile"
                      className="m-auto rounded-full h-24 w-24 flex focus:outline-none"
                      onClick={handleProfilePictureReuploadClick}
                    />
                  ) : (
                    <div
                      className="m-auto bg-primary-200 rounded-full h-24 w-24 flex focus:outline-none"
                      onClick={handleProfilePictureClick}
                    >
                      {phaseState.photoUploading ? (
                        <div
                          className="m-auto"
                          onClick={handleProfilePictureClick}
                        >
                          <IonSpinner color="primary" />
                        </div>
                      ) : (
                        <div
                          className="m-auto text-5xl font-bold text-white"
                          onClick={handleProfilePictureClick}
                        >
                          +
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <input
              type="text"
              className="border-none w-full text-xl focus:outline-none placeholder-cool-gray-500 text-center mt-4"
              placeholder="@username"
              value={state.userDetails.username}
              onChange={handleUsernameOnChange}
            />
            <div className="w-full px-1/6 h-10 text-red-700 mt-4 text-center">
              {!phaseState.usernameErrorMessage.length &&
              !!state.userDetails.username.length ? (
                <span className="text-green-700">{`${state.userDetails.username} is available`}</span>
              ) : (
                <span className="text-red-700">
                  {phaseState.usernameErrorMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            className="h-14 flex-1 text-lg font-medium text-primary-700 flex rounded bg-primary-200 mx-2"
            onClick={handleBackOnClick}
          >
            <div className="mx-auto flex items-center">
              <div className="font-medium">Back</div>
            </div>
          </button>
          <button
            className={
              'h-14 flex-1 text-lg font-medium text-white flex rounded mx-2 ' +
              (phaseValid ? 'bg-primary-800' : 'bg-gray-300')
            }
            onClick={handleNextOnClick}
          >
            <div className="mx-auto flex items-center">
              <div className="font-medium">Next</div>
            </div>
          </button>
        </div>
      </div>
    </Div100vh>
  );
};

const PhaseOneScreen = props => {
  const { state, setState, getPosition } = props;

  const handleFirstNameOnChange = e =>
    setState({
      ...state,
      userDetails: { ...state.userDetails, firstName: e.target.value },
    });

  const handleLastNameOnChange = e =>
    setState({
      ...state,
      userDetails: { ...state.userDetails, lastName: e.target.value },
    });
  const handleBirthdayOnChange = e => {
    setState({
      ...state,
      userDetails: {
        ...state.userDetails,
        birthday: new Date(e.detail.value),
      },
    });
  };

  const handleGenderOnChange = e =>
    setState({
      ...state,
      userDetails: { ...state.userDetails, gender: e.detail.value },
    });

  const phaseOneValid =
    !!state.userDetails.firstName.length &&
    !!state.userDetails.lastName.length &&
    !!state.userDetails.birthday &&
    state.userDetails.gender;

  const handleNextStepOnClick = () => {
    if (phaseOneValid) {
      setState({
        ...state,
        phase: 2,
      });
    }
  };

  const [phaseState, setPhaseState] = useState({
    coordinates: null,
    address: null,
    location: null,
  });

  useEffect(() => {
    if (
      state.currentPosition?.coords?.latitude &&
      state.currentPosition?.coords?.longitude
    ) {
      const asyncSetAddress = async () => {
        const res = await geoCode({
          latitude: state.currentPosition.coords.latitude,
          longitude: state.currentPosition.coords.longitude,
        });
        const address = res.data.results[0];
        setPhaseState(phaseState => {
          return {
            ...phaseState,
            address: address,
          };
        });
      };

      asyncSetAddress();
    }
  }, [state.currentPosition]);

  useEffect(() => {
    if (phaseState.address) {
      const countryComponentList = phaseState.address.address_components.filter(
        component => component.types.includes('country')
      );

      if (!!countryComponentList.length) {
        const neighborhoodComponentList = phaseState.address.address_components.filter(
          component =>
            component.types.includes('neighborhood') ||
            component.types.includes('locality') ||
            component.types.includes('sublocality') ||
            component.types.includes('administrative_area_level_1')
        );

        if (!!neighborhoodComponentList.length) {
          const country = countryComponentList[0].long_name;
          const neighborhood = neighborhoodComponentList[0].long_name;

          setState(state => {
            return {
              ...state,
              userDetails: {
                ...state.userDetails,
                location: {
                  country,
                  neighborhood,
                  details: {
                    address: phaseState.address,
                    coordinates: phaseState.coordinates,
                  },
                },
              },
            };
          });
        }
      }
    }
  }, [phaseState.address, phaseState.coordinates, setState]);

  console.log(state);

  return (
    <Div100vh>
      <div className="w-full h-full py-8 px-6 flex flex-col">
        <div className="text-5xl font-medium">
          Hello,
          <br />
          <span className="text-gray-500 font-normal">
            Welcome to
            <br />
            the Squad!
          </span>
        </div>
        <div className="text-xl text-gray-700 mt-4">
          Tell us a bit about yourself...
        </div>
        <div className="flex-1 flex">
          <div className="m-auto w-full">
            <div className="flex">
              <div className="flex-1">
                <label className="font-medium text-gray-700">First Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    className="border-none w-full text-xl focus:outline-none placeholder-cool-gray-500"
                    placeholder="Your first name"
                    value={state.userDetails.firstName}
                    onChange={handleFirstNameOnChange}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="font-medium text-gray-700">Last Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    className="border-none w-full text-xl focus:outline-none placeholder-cool-gray-500"
                    placeholder="Your last name"
                    value={state.userDetails.lastName}
                    onChange={handleLastNameOnChange}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex">
              <div className="flex-1">
                <label className="font-medium text-gray-700">Birthday</label>
                <div className="mt-2">
                  <IonDatetime
                    displayFormat="MMM DD, YYYY"
                    value={state.userDetails.birthday?.toISOString()}
                    onIonChange={handleBirthdayOnChange}
                    placeholder="Select Date"
                    className="text-lg ion-no-margin ion-no-padding placeholder-gray-600"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="font-medium text-gray-700">Location</label>
                <div className="mt-2">
                  <div className="text-lg">
                    {state.userDetails.location ? (
                      <div className="">
                        {state.userDetails.location.neighborhood},{' '}
                        {state.userDetails.location.country}
                      </div>
                    ) : (
                      <span
                        className="cursor-pointer"
                        style={{ color: '#999999' }}
                        onClick={() => getPosition()}
                      >
                        Enable Location
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="font-medium text-gray-700">Gender</label>
              <div className="text-xl mt-2 w-1/2">
                <IonSegment
                  value={state.userDetails.gender}
                  onIonChange={handleGenderOnChange}
                >
                  <IonSegmentButton value="male">
                    <span
                      className={
                        state.userDetails.gender === 'male'
                          ? 'text-primary-700 font-bold'
                          : 'font-medium'
                      }
                    >
                      Male
                    </span>
                  </IonSegmentButton>
                  <IonSegmentButton value="female">
                    <span
                      className={
                        state.userDetails.gender === 'female'
                          ? 'text-primary-700 font-bold'
                          : 'font-medium'
                      }
                    >
                      Female
                    </span>
                  </IonSegmentButton>
                </IonSegment>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button
            className={
              'h-14 w-full text-lg font-medium text-white w-full flex rounded ' +
              (phaseOneValid ? 'bg-primary-800' : 'bg-gray-300')
            }
            onClick={handleNextStepOnClick}
          >
            <div className="mx-auto flex items-center">
              <div className="font-medium">Next Step</div>
            </div>
          </button>
        </div>
      </div>
    </Div100vh>
  );
};

export default WelcomePage;
