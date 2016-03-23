import Ember from 'ember';

export default Ember.Controller.extend({
  pushServices: Ember.inject.service('push'),
  hideBackButton: true,
  init: function() {
    if (window.cordova) {
      Ember.$("body").addClass("platform-" + cordova.platformId);
      this.get("pushServices").register(this, "receivedPush");
    } else {
      //Default the styling to that of android
      Ember.$("body").addClass("platform-android");

      //This is for testing ios Specific styles and should be commented out for production
      //Ember.$("body").addClass("platform-ios");
    }
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
    receivedPush: function(data) {
      console.log("Application received push: ", data);
    }
  }
});