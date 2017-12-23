import Ember from 'ember';

export default Ember.Route.extend({
  setupUtils: Ember.inject.service('setup'),
  status: Ember.inject.service('status'),
  settings: Ember.inject.service('settings'),
  vka: Ember.inject.service('vka'),
  facebook: Ember.inject.service('facebook'),
  cognito: Ember.inject.service('cognito'),
  ts: Ember.inject.service('ts'),
  analytics: Ember.inject.service('analytics'),
  isSetUp: function() {return false;}.property(),
  model: function () {
    this.get("ts").setup();
    this.get("status").loading(ts("checking-updates", "Checking for Updates"));
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (that.get("isSetUp")) {
        resolve();
        if (navigator && navigator.splashscreen) { navigator.splashscreen.hide(); }
      } else {
        that.get("setupUtils").appStartup().then(function () {
          that.set("isSetUp", true);
          if (navigator && navigator.splashscreen) { navigator.splashscreen.hide(); }
          resolve();
        }, function () {
          that.set("isSetUp", true);
          if (navigator && navigator.splashscreen) { navigator.splashscreen.hide(); }
          resolve();
        });
      }
    });
  },
  afterModel: function(transition) {
    //Start by showing "today"
    this.get("status").complete();
    var today = this.get("vka").getToday();
    this.transitionTo("day", {"queryParams": {"currentDay": today}});
  },
  actions: {
    willTransition: function() {
      this.get("status").loading();
    },
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
        this.get("status").complete();
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
