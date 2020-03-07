import React from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { useFirebase } from 'react-redux-firebase';

import Div100vh from 'react-div-100vh';
import { logoFacebook } from 'ionicons/icons';

const LoginPage: React.FC = () => {
  const firebase = useFirebase();
  const loginWithGoogle = () => {
    return firebase.login({ provider: 'google', type: 'redirect' });
  };

  const loginWithFacebook = () => {
    return firebase.login({ provider: 'facebook', type: 'redirect' });
  };

  return (
    <IonPage>
      <IonContent>
        <Div100vh>
          <div className="w-full h-full pt-8 pb-12 flex flex-col">
            <div className="m-auto flex flex-col w-full">
              <div className="pb-6">
                <div className="font-title font-black text-black text-4xl text-center">
                  SQUAD
                </div>
              </div>
              <div className="text-2xl font-medium text-black text-center pb-12">
                Workouts are better
                <br />
                together
              </div>
              <div className="px-10">
                <button
                  className="bg-white h-14 w-full text-lg font-medium text-gray-800 w-full flex rounded"
                  style={{ border: 'solid 1px #000' }}
                  onClick={loginWithGoogle}
                >
                  <div className="mx-auto flex items-center">
                    <img
                      src="assets/images/google-logo.png"
                      alt=""
                      className="h-5"
                    />
                    <div className="ml-4">Login with Google</div>
                  </div>
                </button>
              </div>
              <div className="px-10 mt-4">
                <button
                  className="bg-blue-900 text-white h-14 w-full text-lg font-medium w-full flex rounded"
                  onClick={loginWithFacebook}
                >
                  <div className="mx-auto flex items-center">
                    <IonIcon icon={logoFacebook} className="h-5 w-5" />
                    <div className="ml-4">Login with Facebook</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </Div100vh>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
