import Ember from 'ember';

export default Ember.Controller.extend({
  vka: Ember.inject.service('vka'),
  hideBackButton: true,
  init: function() {
    if (window.cordova) {
      Ember.$("body").addClass("platform-" + cordova.platformId);
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
    viewToday: function() {
      this.transitionToRoute("day", this.get("vka").getToday());
    }
  }
});