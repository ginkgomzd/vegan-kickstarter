import Ember from 'ember';

var cognitoService = Ember.Service.extend({
  facebook: Ember.inject.service('facebook'),
  settings: Ember.inject.service('settings'),
  loggedIn: function() {return false;}.property(),
  startSession: function() {
    var cognitoIDC = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: EmberENV.AWS.CognitoRegion + ':' + EmberENV.AWS.CognitoIdentityPool
    });
    var fbToken = this.get("settings").load("facebookToken");
    if(fbToken) {
      cognitoIDC.params.Logins = {};
      cognitoIDC.params.Logins["graph.facebook.com"] = fbToken;
      cognitoIDC.expired = true;
      this.set("loggedIn", true);
    }

    AWS.config.credentials = cognitoIDC;
  },
  login: function(providerName, token) {
    AWS.config.credentials.params.Logins = {};
    AWS.config.credentials.params.Logins[providerName] = token;
    AWS.config.credentials.expired = true;
    this.set("loggedIn", true);
    this.syncSettings();
  },
  facebookLogin: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      that.get("facebook").login().then(
        function(userData) {
          that.get("settings").save("facebookToken", userData.authResponse.accessToken);
          that.login("graph.facebook.com", userData.authResponse.accessToken);
          resolve();
        },
        function(error) {
          console.log("Facebook Login Error: ", error);
          reject();
        });
    });
  },
  syncSettings: function() {
    console.log("Todo: Setup settings Sync");
  },
  pushSetting: function(name, value) {
    console.log("Todo: Setup pushSetting");
  },
  pullSetting: function(name) {
    console.log("Todo: Setup pullSetting");
  },
  isLoggedIn: function() {
    return this.get("loggedIn");
  },
  Logout: function() {
    AWS.config.credentials.params.Logins = {};
    AWS.config.credentials.expired = true;
    this.set("loggedIn", false);
    this.get("settings").save("facebookToken", null);
  }
});

export default cognitoService;
