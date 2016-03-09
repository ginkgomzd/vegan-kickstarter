import Ember from 'ember';

export default Ember.Route.extend({
  setupUtils: Ember.inject.service('setup'),
  settings: Ember.inject.service('settings'),
  model: function () {
    return this.get("setupUtils").appStartup();
  },
  afterModel: function(transition) {
    //This is where we will calculate which day should be shown
    //this.transitionTo("day", 1);
  },
  actions: {
    didTransition: function(transition) {
      Ember.run.later(this, function() {
        var mode =  this.controllerFor(this.controller.currentRouteName).get("showBackButton") || 'always';

        var platformName = "web";
        //var platformName = "ios";
        //var platformName = "android";

        if (window.cordova) {
          platformName = cordova.platformId;
        }

        var showBB = (mode === "always" || mode === platformName);
        this.get("settings").sessionVar("showBackButton", showBB);
      }, 5);
    }
  }
});