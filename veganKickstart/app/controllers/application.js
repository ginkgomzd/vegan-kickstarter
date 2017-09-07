import Ember from 'ember';

export default Ember.Controller.extend({
  hideBackButton: true,
  vka: Ember.inject.service('vka'),
  firebase: Ember.inject.service('firebase'),
  debug: Ember.inject.service('debug'),
  cognito: Ember.inject.service('cognito'),
  init: function() {
    var app = this;
    if (EmberENV.iOSMock) {
      //This is for testing ios Specific styles
      Ember.$("body").addClass("platform-ios");
    } else if (window.cordova) {
      Ember.$("body").addClass("platform-" + cordova.platformId);
    } else {
      Ember.$("body").addClass("platform-android");
    }

    app.get('firebase').plugin.onTokenRefresh(function(data){
      app.get('debug').log('onTokenRefresh::token:'+data);
      app.get('cognito').registerDevice(data);
    });

    app.get('firebase').plugin.onNotificationOpen(function(notification) {
     app.get('debug').log('Application::receivedPush');
     var msg = notification.message || notification.additionalData.default || false;
     if (msg) {
       var title = notification.title || ts("push-title");
       app.send("openModal", msg, title, notification.additionalData);
     }
   });
  },
  actions: {
    executeBackAction: function() {
      window.history.back();
    },
    gotoSettings: function() {
      this.transitionToRoute("settings");
    },
    gotoSearch: function() {
      this.transitionToRoute("search");
    },
    viewToday: function() {
      var today = this.get("vka").getToday();
      this.transitionToRoute("day", {"queryParams": {"currentDay": today}});
    }
  }
});
