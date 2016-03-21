import Ember from 'ember';

var pushServices = Ember.Service.extend({
  push: null,
  init: function(context, receivedAction) {
    if (typeof PushNotification !== "undefined") {
      //this is so that we can register multiple listeners.
      this.push = this.push ||  PushNotification.init({
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
        console.log(data);
        //todo: register this ID with Amazon.
        // data.registrationId
      });

      this.push.on('notification', function (data) {
        console.log(data);
        context.send(receivedAction, data);
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
      });

      this.push.on('error', function (e) {
        console.log(e);
        // e.message
      });
    }
  }
});

export default pushServices;