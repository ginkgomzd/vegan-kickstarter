import Ember from 'ember';

export default Ember.Route.extend({
  setupUtils: Ember.inject.service('setup'),
  settings: Ember.inject.service('settings'),
  dateHelper: Ember.inject.service('date-functions'),
  model: function () {
    return this.get("setupUtils").appStartup();
  },
  afterModel: function(transition) {
    //This is where we will calculate which day should be shown
    var startedDateString = this.get("settings").load("startedKickstarter");
    var day;

    if (startedDateString) {
      var started = new Date(startedDateString);
      day = this.get("dateHelper").daysBetween(started);
    } else {
      this.get("settings").save("startedKickstarter", this.get("dateHelper").formatDate());
      day = 1;
    }

    if ((day > 21) || day === "Invalid Date") {
      this.transitionTo("day", 1);
    } else {
      this.transitionTo("day", day);
    }
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