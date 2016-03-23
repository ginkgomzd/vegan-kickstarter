import Ember from 'ember';

var pushServices = Ember.Service.extend({
  push: null,
  init: function() {
    if (typeof PushNotification !== "undefined") {
      //this is so that we can register multiple listeners.
      this.push = this.push || PushNotification.init({
          android: {
            senderID: EmberENV.GCMSenderID
          },
          ios: {
            alert: "true",
            badge: "true",
            sound: "true"
          },
          windows: {}
        });

      this.push.on('registration', function (data) {
        console.log("Push Registration: ", data);
        //todo: register this ID with Amazon.
        // data.registrationId
      });

      this.push.on('error', function (e) {
        console.log("Push Error: ", e);
        // e.message
      });
    } else {
      console.log("Push notifications Disabled");
    }
  },
  register: function(context, notificationAction) {
    if (this.push) {
      this.push.on('notification', function (data) {
        console.log("Push Notification: ", data);
        context.send(notificationAction, data);
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
      });
    } else {
      console.log("No push service to register with");
    }
  }
});

export default pushServices;