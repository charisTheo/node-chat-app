const webPush = require('web-push');
const PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY;

if (process.env.NODE_ENV === 'dev') {
  const keys = require('../keys.json');
  PUBLIC_VAPID_KEY = keys.PUBLIC_VAPID_KEY;
  PRIVATE_VAPID_KEY = keys.PRIVATE_VAPID_KEY;
  
} else {
  PUBLIC_VAPID_KEY = process.env.PUBLIC_VAPID_KEY;
  PRIVATE_VAPID_KEY = process.env.PRIVATE_VAPID_KEY;

}

webPush.setVapidDetails(
  'mailto:dev@charistheo.io',
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

module.exports = {webPush}