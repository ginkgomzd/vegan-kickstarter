import Ember from 'ember';

export default Ember.Route.extend({
  setupUtils: Ember.inject.service('setup'),
  settings: Ember.inject.service('settings'),
  vka: Ember.inject.service('vka'),
  facebook: Ember.inject.service('facebook'),
  cognito: Ember.inject.service('cognito'),
  model: function () {
    var that = this;
    return this.get("setupUtils").appStartup();
  },
  afterModel: function(transition) {
    //Start by showing "today"
    this.transitionTo("day", this.get("vka").getToday());
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
        this.get("settings").setSessionVar("showBackButton", showBB);
      }, 5);
    }
  }
});