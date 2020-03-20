import React, { useContext, useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonModal,
} from '@ionic/react';
import '../css/iondefaults.css';
import {
  locationOutline,
  imagesOutline,
  videocamOutline,
} from 'ionicons/icons';
import { useSelector } from 'react-redux';
import { StreamContext } from '../scripts/StreamContext';

const INITIAL_LOAD_NUM = 10;

const HomeTab: React.FC = () => {
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);
  const client = useContext(StreamContext);
  const [state, setState] = useState({
    initialPostsLoaded: false,
    posts: [],
    postOffset: 0,
    openedModal: 'status',
  });

  const timelineFeed = client.feed('timeline', auth.uid);
  const userFeed = client.feed('user', auth.uid);

  useEffect(() => {
    timelineFeed.get({ limit: INITIAL_LOAD_NUM, offset: 0 }).then(response =>
      setState(state => {
        return {
          ...state,
          initialPostsLoaded: true,
          posts: response.results,
          postOffset: state.postOffset + response.results.length,
        };
      })
    );
  }, [auth.uid, timelineFeed]);

  const handleNewStatusOnClick = () => {
    setState(state => {
      return {
        ...state,
        openedModal: 'status',
      };
    });
  };

  return (
    <IonPage>
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
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-content-gray">
        <StatusModal
          state={state}
          setState={setState}
          profile={profile}
          userFeed={userFeed}
        />
        <div className="grid grid-cols-1 gap-2">
          <div className="w-full bg-white flex flex-col">
            <div
              className="h-16 flex items-center"
              style={{ borderBottom: 'solid 1px #CCC' }}
            >
              <div className="pl-4 pr-3 pt-1">
                <img
                  src={profile.profilePictureUrl}
                  alt=""
                  className="h-10 rounded-full"
                />
              </div>
              <div className="text-gray-700" onClick={handleNewStatusOnClick}>
                Tell us about your workout
              </div>
            </div>
            <div className="h-10 flex py-2">
              <div className="flex-1 flex">
                <div className="m-auto flex items-center text-gray-500 relative">
                  <input
                    type="file"
                    accept="video/*"
                    className="bg-gray-200 rounded-ful flex h-full w-full focus:outline-none absolute z-10 opacity-0"
                  ></input>
                  <IonIcon icon={videocamOutline} />
                  <span className="ml-2 text-sm">Video</span>
                </div>
              </div>
              <div
                className="flex-1 flex"
                style={{
                  borderRight: 'solid 1px #CCC',
                  borderLeft: 'solid 1px #CCC',
                }}
              >
                <div className="m-auto flex items-center text-gray-500 relative">
                  <input
                    type="file"
                    accept="image/jpeg"
                    className="bg-gray-200 rounded-ful flex h-full w-full focus:outline-none absolute z-10 opacity-0"
                  ></input>
                  <IonIcon icon={imagesOutline} />
                  <span className="ml-2 text-sm">Photos</span>
                </div>
              </div>
              <div className="flex-1 flex">
                <div className="m-auto flex items-center text-gray-500">
                  <IonIcon icon={locationOutline} />
                  <span className="ml-1 text-sm">Check In</span>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="bg-white pt-6 pb-4">
            <div className="mx-6 text-2xl font-semibold">
              Your upcoming events
            </div>
            <div className="pt-2 flex overflow-x-scroll scrolling-touch px-4">
              <SampleEventCard />
              <SampleEventCard />
              <SampleEventCard />
              <div className="flex-grow-0 flex-shrink-0 flex-auto w-4"></div>
            </div>
          </div> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

const StatusModal = props => {
  const { state, setState, profile } = props;
  const [modalState, setModalState] = useState({
    status: {
      caption: '',
      content: {},
      postType: state.openedModal,
      privacy: 'Public',
    },
  });

  const handleCancelOnClick = () => {
    setState(state => {
      return {
        ...state,
        openedModal: '',
      };
    });
  };

  const handleCaptionOnChange = e => {
    setModalState({
      ...modalState,
      status: {
        ...modalState.status,
        caption: e.target.value,
      },
    });
  };

  const handlePrivacyOptionOnClick = privacy => {
    if (modalState.status.privacy !== privacy) {
      setModalState({
        ...modalState,
        status: {
          ...modalState.status,
          privacy,
        },
      });
    }
  };

  // const handleImageUploaded = async e => {
  //   if (!!e.target.files.length) {
  //     const imageFile = e.target.files[0];
  //     const storageRef = firebase
  //       .storage()
  //       .ref(
  //         `/userProfilePictures/${auth.uid}.${
  //           imageFile.name.split('.').slice(-1)[0]
  //         }`
  //       );
  //     await storageRef.put(imageFile);
  //     const imageDownloadUrl = await storageRef.getDownloadURL();
  //     setState(state => {
  //       return {
  //         ...state,
  //         userDetails: {
  //           ...state.userDetails,
  //           profilePictureUrl: imageDownloadUrl,
  //         },
  //       };
  //     });
  //   }
  // };

  return (
    <>
      <IonModal isOpen={!!state.openedModal.length}>
        <div className="w-full h-full flex flex-col">
          <div className="h-14 bg-gray-50 flex items-center text-center px-4">
            <div className="text-gray-500" onClick={handleCancelOnClick}>
              Cancel
            </div>
            <div className="flex-1 font-semibold text-lg">Create Post</div>
            <div
              className={
                'font-extrabold text-lg ' +
                (!!modalState.status.caption.length
                  ? 'text-primary-700'
                  : 'text-gray-300')
              }
            >
              Post
            </div>
          </div>
          <div className="w-full mt-2">
            <div className="h-16 flex items-center">
              <div className="pl-4 pr-3 pt-1">
                <img
                  src={profile.profilePictureUrl}
                  alt=""
                  className="h-12 rounded-full"
                />
              </div>
              <div className="ml-1">
                <div className="font-bold text-lg">{profile.username}</div>
                <div className="h-6 flex">
                  <div className="h-full rounded flex items-center text-sm text-gray-500">
                    <div
                      className={
                        modalState.status.privacy === 'Public'
                          ? 'font-bold text-gray-700'
                          : 'font-normal'
                      }
                      onClick={() => handlePrivacyOptionOnClick('Public')}
                    >
                      Public
                    </div>
                    <div className="text-gray-300">&nbsp; • &nbsp;</div>
                    <div
                      className={
                        modalState.status.privacy === 'Private'
                          ? 'font-extrabold text-gray-700'
                          : 'font-normal'
                      }
                      onClick={() => handlePrivacyOptionOnClick('Private')}
                    >
                      Private
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex-1">
            <textarea
              className="w-full h-full focus:outline-none border-none text-lg p-4 placeholder-gray-500"
              style={{ resize: 'none' }}
              placeholder="Tell us about your workout"
              onChange={handleCaptionOnChange}
              value={modalState.status.caption}
            />
          </div>
          {state.openedModal === 'status' && (
            <div
              className="rounded-t-lg pt-2"
              style={{ borderTop: 'solid 1px #CCC' }}
            >
              <div
                className="flex w-full text-lg items-center py-4 px-4 text-gray-700 relative"
                style={{ borderBottom: 'solid 1px #CCC' }}
              >
                <input
                  type="file"
                  accept="image/jpeg"
                  className="bg-gray-200 rounded-ful flex h-full focus:outline-none absolute z-10 opacity-0"
                ></input>
                <IonIcon icon={imagesOutline} className="w-6 h-6" />
                <div className="ml-4">Add Photos</div>
              </div>
              <div
                className="flex w-full text-lg items-center py-4 px-4 text-gray-700 relative"
                style={{ borderBottom: 'solid 1px #CCC' }}
              >
                <input
                  type="file"
                  accept="video/*"
                  className="bg-gray-200 rounded-ful flex h-full focus:outline-none absolute z-10 opacity-0"
                ></input>
                <IonIcon icon={videocamOutline} className="w-6 h-6" />
                <div className="ml-4">Add Video</div>
              </div>
              <div className="flex w-full text-lg items-center py-4 px-4 text-gray-700">
                <IonIcon icon={locationOutline} className="w-6 h-6" />
                <div className="ml-4">Check In</div>
              </div>
            </div>
          )}
        </div>
      </IonModal>
    </>
  );
};

export default HomeTab;
