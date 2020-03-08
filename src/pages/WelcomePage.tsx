import React, { useState, useEffect, useCallback } from 'react';
import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
} from '@ionic/react';
import { useSelector } from 'react-redux';
import {
  isLoaded,
  isEmpty,
  useFirestoreConnect,
  useFirebase,
} from 'react-redux-firebase';
import { useCamera } from '@ionic/react-hooks/camera';
import { CameraResultType } from '@capacitor/core';

import algoliasearch from 'algoliasearch/lite';

import Div100vh from 'react-div-100vh';

import { getInvalidUsernameMessage } from '../scripts/getInvalidUsernameMessage';

const WelcomePage: React.FC = () => {
  const [state, setState] = useState({
    phase: 1,
    userDetails: {
      firstName: '',
      lastName: '',
      age: '',
      gender: null,
      username: '',
      profilePictureUrl: null,
      profilePictureUrls: null,
    },
  });
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

  const isLoading = !isLoaded(auth) || !isLoaded(profile);
  const isLoggedIn = !isLoading && !isEmpty(auth);
  const isRegisteredUser = isLoggedIn && !isEmpty(profile);
  const profileComplete = isRegisteredUser && !!profile?.activities.length;

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
          <PhaseOneScreen state={state} setState={setState} />
        )}
        {state.phase === 2 && (
          <PhaseTwoScreen state={state} setState={setState} auth={auth} />
        )}
        {state.phase === 3 && (
          <PhaseThreeScreen state={state} setState={setState} auth={auth} />
        )}
      </IonContent>
    </IonPage>
  );
};

const PhaseThreeScreen = props => {
  const { state, setState, auth } = props;

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
        <div className="flex-1 flex">
          <div className="m-auto w-full"></div>
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
    !!state.userDetails.username.length;

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
      });
      setState({
        ...state,
        phase: 3,
      });
    }
  };

  console.log(state);

  return (
    <Div100vh>
      <div className="w-full h-full py-8 px-6 flex flex-col">
        <div className="text-5xl font-normal text-gray-500">
          It's nice to meet you,
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
  const { state, setState } = props;

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
  const handleAgeOnChange = e =>
    setState({
      ...state,
      userDetails: { ...state.userDetails, age: e.target.value },
    });

  const handleGenderOnChange = e =>
    setState({
      ...state,
      userDetails: { ...state.userDetails, gender: e.detail.value },
    });

  const phaseOneValid =
    !!state.userDetails.firstName.length &&
    !!state.userDetails.lastName.length &&
    Number(state.userDetails.age) > 10 &&
    Number(state.userDetails.age) < 150 &&
    state.userDetails.gender;

  const handleNextStepOnClick = () => {
    if (phaseOneValid) {
      setState({
        ...state,
        phase: 2,
      });
    }
  };

  return (
    <Div100vh>
      <div className="w-full h-full py-8 px-6 flex flex-col">
        <div className="text-5xl font-medium">
          Hello,
          <br />
          <span className="text-gray-500 font-normal">
            Welcome to the Squad!
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
            <div className="mt-4">
              <label className="font-medium text-gray-700">Age</label>
              <div className="mt-1">
                <input
                  type="number"
                  className="border-none w-full text-xl focus:outline-none placeholder-cool-gray-500"
                  placeholder="Your age"
                  value={state.userDetails.age}
                  onChange={handleAgeOnChange}
                />
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
