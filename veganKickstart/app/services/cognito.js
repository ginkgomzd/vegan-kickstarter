import Ember from 'ember';

var cognitoService = Ember.Service.extend({
  facebook: Ember.inject.service('facebook'),
  settings: Ember.inject.service('settings'),
  loggedIn: function() {return false;}.property(),
  startSession: function() {
    AWS.config.region = EmberENV.AWS.CognitoRegion;
    var params = {
      IdentityPoolId: EmberENV.AWS.CognitoRegion + ':' + EmberENV.AWS.CognitoIdentityPool
    };
    var fbToken = this.get("settings").load("facebookToken");
    if(fbToken) {
      params.Logins = {"graph.facebook.com": fbToken};
      this.set("loggedIn", true);
    }
    var cognitoIDC = new AWS.CognitoIdentityCredentials(params);
    AWS.config.credentials = cognitoIDC;
    if(this.isLoggedIn()) {
      this.initCognitoDataset();
    }
  },
  initCognitoDataset: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      AWS.config.credentials.get(function() {
        var client = new AWS.CognitoSyncManager();
        client.openOrCreateDataset(EmberENV.AWS.CognitoDataset, function(err, dataset) {
          that.dataset = dataset;
          if(that.isLoggedIn()) {
            that.syncSettings().then(function() {
              that.preloadSettings();
            });
          }
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
    this.initCognitoDataset();
  },
  facebookLogin: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      that.get("facebook").login().then(
        function(userData) {
          that.get("settings").save("facebookToken", userData.authResponse.accessToken, false);
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
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if(!that.dataset) {
        return reject();
      }

      that.dataset.getAll(function (err, data) {
        if(err) {
          reject(err);
        } else {
          that.get("settings").reloadAllSettings(data);
          resolve();
        }
      });
    });
  },
  syncSettings: function() {
    //console.log("Starting Cognito Sync");
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      //This code is copy/pasted directly from the sample on github
      //see: https://github.com/aws/amazon-cognito-js

      that.dataset.synchronize({
        onSuccess: function(dataset, newRecords) {
          //console.log("Sync Success: ", dataset);
          resolve(dataset);
        },
        onFailure: function(err) {
          //console.log("Sync Fail");
          reject(err);
        },
        onConflict: function(dataset, conflicts, callback) {
          //console.log("Sync Conflict");
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
          //console.log("Sync Deleted");
          // Return true to delete the local copy of the dataset.
          // Return false to handle deleted datasets outside the synchronization callback.
          return callback(true);
        },

        onDatasetMerged: function(dataset, datasetNames, callback) {
          //console.log("Sync Merge");
          // Return true to continue the synchronization process.
          // Return false to handle dataset merges outside the synchroniziation callback.
          return callback(true);
        }
      });
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
          Ember.run.debounce(that, "syncSettings", 3000);
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
  logout: function() {
    AWS.config.credentials.params.Logins = {};
    AWS.config.credentials.expired = true;
    this.set("loggedIn", false);
    this.get("settings").save("facebookToken", null, false);
  },


  /*************[ Push related functions ]****************/

  registerDevice: function(token) {
    //we only need ot do this once per device/application pairing.
    if (!this.get("settings").load("EndpointArn")) {
      var that = this;
      var sns = new AWS.SNS();
      var params = {
        PlatformApplicationArn: EmberENV.AWS.ApplicationArns[cordova.platformId],
        Token: token,
        //CustomUserData: "",
        //Attributes: {}
      };

      sns.createPlatformEndpoint(params, function (err, data) {
        //data.EndpointArn: The ARN for the newly created endpoint
        //ARN Definition: http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html
        if(data && data.EndpointArn) {
          that.get("settings").save("EndpointArn", data.EndpointArn, false);
          //Subscribe to all default topics.
          for(var i in EmberENV.AWS.DefaultTopics) {
            if (EmberENV.AWS.DefaultTopics.hasOwnProperty(i)) {
              that.subscribeToTopic(EmberENV.AWS.DefaultTopics[i]);
            }
          }
        } else {
          //Error
          console.log("Error", err);
        }
      });
    }
  },
  subscribeToTopic: function(topic) {
    var endpointARN = this.get("settings").load("EndpointArn");
    if(endpointARN) {
      var sns = new AWS.SNS();
      var params = {
        TopicArn: EmberENV.AWS.ApplicationArns.base + ":" + topic,
        Protocol: "application",
        Endpoint: endpointARN
      };
      sns.subscribe(params, function(err, data) {
        if(data) {
          console.log(data);
        } else {
          console.log(err);
        }
      });
    }
  }
});

export default cognitoService;
