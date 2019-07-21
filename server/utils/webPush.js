const webPush = require('web-push');
const keys = require('../keys.json');

webPush.keys = {
  PUBLIC_VAPID_KEY: process.env.PUBLIC_VAPID_KEY || keys.PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY: process.env.PRIVATE_VAPID_KEY || keys.PRIVATE_VAPID_KEY
}

webPush.setVapidDetails(
  'mailto:dev@charistheo.io',
  webPush.keys.PUBLIC_VAPID_KEY,
  webPush.keys.PRIVATE_VAPID_KEY
);

module.exports = {webPush}