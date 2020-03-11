const functions = require('firebase-functions');
const fetch = require('node-fetch');

const GEOCODE_API_KEY = functions.config().google_maps.api_key;

export const geoCode = functions.https.onCall((data: any) => {
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${data.latitude},${data.longitude}&key=${GEOCODE_API_KEY}`
  ).then((res: any) => res.json());
});
