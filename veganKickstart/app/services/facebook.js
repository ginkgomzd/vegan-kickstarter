import Ember from 'ember';

var facebookService = Ember.Service.extend({
  login: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (facebookConnectPlugin) {
        facebookConnectPlugin.login(["public_profile"], function (userData) {
            that.loginSuccess(userData);
            resolve(userData);
          },
          reject
        );
      } else {
        reject("Unable to load Facebook Connect");
      }
    });
  },
  loginSuccess: function(userData) {
    //todo: Connect to Cognito, or some other service.
  },
  logout: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (facebookConnectPlugin) {
        facebookConnectPlugin.logout(resolve, reject);
      } else {
        reject("Unable to load Facebook Connect");
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
  loginStatus: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (facebookConnectPlugin) {
        facebookConnectPlugin.getLoginStatus(resolve);
      } else {
        reject("Unable to load Facebook Connect");
      }
    });
  }
});

export default facebookService;
