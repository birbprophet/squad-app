import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import Div100vh from 'react-div-100vh';

const LoginPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <Div100vh>
          <div className="w-full h-full pt-8 pb-12 flex flex-col tracking-wide">
            <div className="text-3xl font-black font-title text-center opacity-75 pb-6">
              SQUAD
            </div>
            <div className="flex-1 flex px-1/12">
              <div className="m-auto">
                <img src="assets/images/squad-together-splash.png" alt="" />
              </div>
            </div>
            <div className="px-1/5 text-center font-medium leading-7 text-gray-500 opacity-75 pt-8 pb-12">
              It's such a happiness when
              <br />
              good people get together
              <br />
              <span className="text-primary-700">Find your #squad</span>
            </div>
            <div className="px-1/5">
              <button className="bg-primary-700 text-white uppercase w-full py-4 tracking-widest font-semibold rounded-lg">
                Login
              </button>
            </div>
          </div>
        </Div100vh>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
