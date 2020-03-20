const functions = require('firebase-functions');
const stream = require('getstream');

const GETSTREAM_API_KEY = functions.config().getstream.api_key;
const GETSTREAM_API_SECRET = functions.config().getstream.api_secret;
const GETSTREAM_APP_ID = functions.config().getstream.app_id;

const client = stream.connect(
  GETSTREAM_API_KEY,
  GETSTREAM_API_SECRET,
  GETSTREAM_APP_ID
);

export const getStreamToken = functions.https.onCall((uid: string) => {
  return client.createUserToken(uid);
});
