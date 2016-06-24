import Ember from 'ember';

export default Ember.Controller.extend({
  vka: Ember.inject.service('vka'),
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
    viewToday: function() {
      var today = this.get("vka").getToday();
      this.transitionToRoute("day", {"queryParams": {"currentDay": today}});
    },
    receivedPush: function(data) {
      //console.log("Application received push: ", data);
      var msg = data.message || data.additionalData.default || false;
      if (msg) {
        var title = data.title || ts("push-title");
        this.send("openModal", msg, title, data.additionalData);
      }
    }
  }
});