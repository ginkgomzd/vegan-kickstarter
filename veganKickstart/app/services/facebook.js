import Ember from 'ember';

var facebookService = Ember.Service.extend({
  init: function() {
    if (!this.canUseApp()) {
      window.fbAsyncInit = function () {
        FB.init({
          appId: EmberENV.facebookAppID, // Facebook App ID
          status: true,  // check Facebook Login status
          //cookie: true,
          xfbml: false,  // initialize Facebook social plugins on the page
          version: 'v2.3' // point to the latest Facebook Graph API version
        });

        // Run code after the Facebook SDK is loaded.
      };

      Ember.$('body').append(Ember.$("<div>").attr('id', 'fb-root'));
      Ember.$.ajaxSetup({ cache: true });
      Ember.$.getScript('https://connect.facebook.net/en_US/sdk.js');
    }
  },
  appLogin: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (facebookConnectPlugin) {
        facebookConnectPlugin.login(["public_profile"], function (response) {
            that.loginSuccess(response);
            resolve(response);
          },
          reject
        );
      } else {
        reject("Unable to load Facebook Connect");
      }
    });
  },
  webLogin: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (typeof FB === "undefined") {
        reject("Unable to load Facebook Connect");
      } else {
        FB.login(function (response) {
          if (response.authResponse) {
            that.loginSuccess(response);
            resolve(response);
          } else {
            reject();
          }
        });

      }
    });
  },
  login: function() {
    if (this.canUseApp()) {
      return this.appLogin();
    } else {
      return this.webLogin();
    }
  },
  loginSuccess: function(userData) {
    //todo: Connect to Cognito, or some other service.
  },
  logout: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (that.canUseApp()) {
        facebookConnectPlugin.logout(resolve, reject);
      } else {
        FB.logout(resolve, reject);
      }
    });
  },
  getFacebookToken: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (facebookConnectPlugin) {
        facebookConnectPlugin.getAccessToken(function (token) {
          resolve(token);
        });
      } else {
        reject("Unable to load Facebook Connect");
      }
    });
  },
  canUseApp: function() {
    return !(!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) || typeof facebookConnectPlugin === "undefined");
  },
  loginStatus: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (that.canUseApp()) {
        facebookConnectPlugin.getLoginStatus(resolve);
      } else {
        FB.getLoginStatus(resolve);
      }
    });
  }
});

export default facebookService;
