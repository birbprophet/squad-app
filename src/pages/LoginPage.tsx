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
          <div className="w-full h-full py-8 px-6 flex flex-col">
            <div className="text-5xl font-normal text-gray-500">
              Working out
              <br />
              is better
              <br />
              <span className="font-medium text-black">with friends</span>
            </div>
            <div className="text-xl text-gray-700 mt-4">
              Get started by creating an account
            </div>
            <div className="flex-1 flex"></div>
            <div className="pt-8">
              <div className="">
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
              <div className="mt-4">
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
            <div
              className="pt-6 mt-8 font-medium text-center"
              style={{ borderTop: 'solid 2px #CBD5E0' }}
            >
              <a
                href="https://squad.fitness"
                className="no-underline text-gray-400"
              >
                What is Squad?
              </a>
            </div>
          </div>
        </Div100vh>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
