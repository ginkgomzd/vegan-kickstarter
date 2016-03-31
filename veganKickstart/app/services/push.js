import Ember from 'ember';

var pushServices = Ember.Service.extend({
  cognito: Ember.inject.service('cognito'),
  push: null,
  init: function() {
    var pushService = this;
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
        //console.log("Push Registration: ", data);

        //data.registrationId: The unique Device token to use in
        //creation of a new application endpoint.

        //Register this ID with Amazon.
        pushService.get("cognito").registerDevice(data.registrationId);
      });

      this.push.on('error', function (e) {
        console.log("Push Error: ", e);
        // e.message
      });
    } else {
      console.log("Push notifications Disabled");
    }
    this._super();
  },
  register: function(context, notificationAction) {
    if (this.push) {
      this.push.on('notification', function (data) {
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
        //console.log("Push Notification: ", data);
        context.send(notificationAction, data);
      });
    } else {
      console.log("No push service to register with");
    }
  }
});

export default pushServices;