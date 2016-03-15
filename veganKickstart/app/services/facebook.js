import Ember from 'ember';

var facebookService = Ember.Service.extend({
  login: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (window.facebookConnectPlugin) {
        facebookConnectPlugin.login(["public_profile"], function (userData) {
            that.loginSuccess(userDate);
            resolve(userData);
          },
          reject
        );
      } else {
        reject();
      }
    });
  },
  loginSuccess: function() {
    //todo: Connect to Cognito, or some other service.
  },
  getFacebookToken: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (window.facebookConnectPlugin) {
        facebookConnectPlugin.getAccessToken(function (token) {
          resolve(token);
        });
      } else {
        reject();
      }
    });
  },
  loginStatus: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (window.facebookConnectPlugin) {
        facebookConnectPlugin.getLoginStatus(function onLoginStatus(status) {
          resolve(status);
        });
      } else {
        reject();
      }
    });
  }
});

export default facebookService;
