const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const algoliaFunctions = require('algolia-firebase-functions');

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;

const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

export const syncActivitiesListWithAlgolia = functions.firestore
  .document('/activitiesList/{childDocument}')
  .onWrite((change: any) => {
    const index = client.initIndex('activitiesList');
    algoliaFunctions.syncAlgoliaWithFirestore(index, change);
  });

export const syncSubActivitiesListWithAlgolia = functions.firestore
  .document('/subActivitiesList/{childDocument}')
  .onWrite((change: any) => {
    const index = client.initIndex('subActivitiesList');
    algoliaFunctions.syncAlgoliaWithFirestore(index, change);
  });
