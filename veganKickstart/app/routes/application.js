import Ember from 'ember';

export default Ember.Route.extend({
  setupUtils: Ember.inject.service('setup'),
  settings: Ember.inject.service('settings'),
  facebook: Ember.inject.service('facebook'),
  cognito: Ember.inject.service('cognito'),
  dateHelper: Ember.inject.service('date-functions'),
  isSetUp: function() {return false;}.property(),
  model: function () {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (that.get("isSetUp")) {
        resolve();
      } else {
        that.get("setupUtils").appStartup().then(function () {
          that.set("isSetUp", true);
          resolve();
        }, function () {
          that.set("isSetUp", true);
          resolve();
        });
      }
    });
  },
  afterModel: function(transition) {
    //This is where we will calculate which day should be shown
    var startedDateString = this.get("settings").load("startedKickstarter");
    var day;

    if (startedDateString) {
      var started = new Date(startedDateString);
      day = this.get("dateHelper").daysBetween(started) + 1;
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
        this.get("settings").setSessionVar("showBackButton", showBB);
      }, 5);
    },
    openModal: function(msg, title, params) {
      var modal = this.controllerFor("application").get('comp-modal-main');
      modal.send('showModal', msg, title, params);
    },
    closeModal: function() {
      var modal = this.controllerFor("application").get('comp-modal-main');
      modal.send('hideModal');
    }
  }
});