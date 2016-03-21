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
    this.initCognitoDataset();
  },
  initCognitoDataset: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      AWS.config.credentials.get(function() {
        var client = new AWS.CognitoSyncManager();
        client.openOrCreateDataset(EmberENV.AWS.CognitoDataset, function(err, dataset) {
          that.dataset = dataset;
          resolve(dataset);
        });
      });
    });
  },
  login: function(providerName, token) {
    var that = this;
    AWS.config.credentials.params.Logins = {};
    AWS.config.credentials.params.Logins[providerName] = token;
    AWS.config.credentials.expired = true;
    this.set("loggedIn", true);
    this.initCognitoDataset().then(function() {
      that.preloadSettings();
    });
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
  preloadSettings: function() {

  },
  syncSettings: function() {
    //This code is copy/pasted directly from the sample on github
    //see: https://github.com/aws/amazon-cognito-js
    this.dataset.synchronize({

      onSuccess: function(dataset, newRecords) {

      },
      onFailure: function(err) {

      },
      onConflict: function(dataset, conflicts, callback) {
        var resolved = [];
        for (var i=0; i<conflicts.length; i++) {
          // Take remote version.
          resolved.push(conflicts[i].resolveWithRemoteRecord());

          // Or... take local version.
          // resolved.push(conflicts[i].resolveWithLocalRecord());

          // Or... use custom logic.
          // var newValue = conflicts[i].getRemoteRecord().getValue() + conflicts[i].getLocalRecord().getValue();
          // resolved.push(conflicts[i].resolveWithValue(newValue);
        }

        dataset.resolve(resolved, function() {
          return callback(true);
        });

        // Or... callback false to stop the synchronization process.
        // return callback(false);
      },

      onDatasetDeleted: function(dataset, datasetName, callback) {
        // Return true to delete the local copy of the dataset.
        // Return false to handle deleted datasets outside the synchronization callback.
        return callback(true);
      },

      onDatasetMerged: function(dataset, datasetNames, callback) {
        // Return true to continue the synchronization process.
        // Return false to handle dataset merges outside the synchroniziation callback.
        return callback(false);
      }
    });
  },

  putSetting: function(key, value) {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {

      if(!that.dataset) {
        return reject();
      }

      that.dataset.put(key, value, function(err, record) {
        if(!record) {
          reject(err);
        } else {
          resolve(record);
        }
      });
    });
  },
  getSetting: function(key) {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {

      if(!that.dataset) {
        return reject();
      }

      that.dataset.get(key, function(err, value) {
        if(!value) {
          resolve(null);
        } else {
          resolve(value);
        }
      });
    });
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
