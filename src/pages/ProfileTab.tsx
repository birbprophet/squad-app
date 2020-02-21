import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonItemGroup,
  IonItem,
  IonAvatar,
  IonText
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import "./ProfileTab.css";

const ProfileTab: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle>
              <span
                className="font-title"
                style={{ fontWeight: 900, fontSize: "1.2rem" }}
              >
                squad
              </span>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem lines="none" className="ion-padding">
          <IonItem lines="none" slot="end">
            <IonAvatar style={{ width: "64px", height: "64px" }}>
              <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
            </IonAvatar>
          </IonItem>
          <IonItem lines="none" className="leading-snug">
            <IonText
              style={{
                textAlign: "center",
                width: "100%",
                lineHeight: "1"
              }}
            >
              <h2>Benjamin Tang</h2>
              <span className="text-gray-600">Edit Profile</span>
            </IonText>
          </IonItem>
        </IonItem>

        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
      </IonContent>
    </IonPage>
  );
};

const doRefresh = (event: CustomEvent<RefresherEventDetail>) => {
  console.log("Begin async operation");

  setTimeout(() => {
    console.log("Async operation has ended");
    event.detail.complete();
  }, 2000);
};

export default ProfileTab;
