import Ember from 'ember';
/*** [  Data is exported from CMS and any changes should be reflected there.  ] ***/
import staticDayData from '../data/day';
import staticRecipeData from '../data/recipe';
import staticImageData from '../data/image';
import expectedEntityCounts from '../data/entities';


var setupService = Ember.Service.extend({
  store: Ember.inject.service('store'),
  settings: Ember.inject.service('settings'),
  dateHelper: Ember.inject.service('date-functions'),
  cmsUtils: Ember.inject.service('cmsUtils'),
  facebook: Ember.inject.service('facebook'),
  cognito: Ember.inject.service('cognito'),
  debug: Ember.inject.service('debug'),
  /**
   * Calls updateAll if enough time has elapsed.
   * Always resolves but will pass true or false if updateAll was not called.
   * @return {[type]} [description]
   */
  checkForUpdates: function() {
    var setup = this;
    var today = setup.get("dateHelper").formatDateTime();
    var dateHelper = setup.get("dateHelper");
    var debug = this.get('debug');
    //Calculate the last updated date
    var lastUpdated = this.get("settings").load("lastUpdatedDate");
    if (!lastUpdated) {
      lastUpdated = EmberENV.staticDataUpdatedDate;
    }

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (dateHelper.daysBetween(new Date(lastUpdated), new Date(today)) > 1 ) {
        setup.get("cmsUtils").updateAll(lastUpdated).then(function(updated) {
          debug.log('UpdateAll complete:'+today);
          setup.get("settings").save("lastUpdatedDate", today, false);
          resolve(true);
        }, function() {
          resolve(false);
        });
      } else {
        debug.log("lastUpdated check:: not enough time elapsed");
        resolve(false);
      }
    });

  },
  loadStaticDataForModel: function(modelInfo, staticData) {
    var setup = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      localforage.getItem(modelInfo.emberDataNamespace, function(err, value) {
        if (!value) {
          value = {};
        }
        if (!value.hasOwnProperty(modelInfo.modelName)) {
          value[modelInfo.modelName] = {};
          value[modelInfo.modelName].records = {};
        }
        if (Object.keys(value[modelInfo.modelName].records).length < expectedEntityCounts[modelInfo.modelName]) {
          staticData.forEach(function (item) {
            if (!value[modelInfo.modelName].records.hasOwnProperty(item.id)) {
              if (typeof setup[modelInfo.modelName + "Defaults"] === "function") {
                setup[modelInfo.modelName + "Defaults"](item);
              }
              value[modelInfo.modelName].records[item.id] = item;
            }
          });
          localforage.setItem(modelInfo.emberDataNamespace, value).then(function() {
            resolve(true);
          });
        } else {
          resolve(false);
        }
      });
    });
  },

  validateDatabaseVersion: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      localforage.getItem("databaseVersion", function(err, value) {
        if (EmberENV.databaseVersion > value) {
          //Delete the old Database Structure so it can be reloaded.
          localforage.clear();
          //Save the new database version code.
          localforage.setItem("databaseVersion", EmberENV.databaseVersion);
          resolve(EmberENV.databaseVersion);
        } else {
          resolve(false);
        }
      });
    });
  },
  handleLogin: function() {
    var setup = this;
    //return new Ember.RSVP.Promise(function(resolve, reject) {});
  },
  appStartup: function() {
    var setup = this;
    //console.log(this.get("store").unloadAll());
    return new Ember.RSVP.Promise(function(resolve, reject) {
      setup.validateDatabaseVersion().then(function(fetchUserData) {

        var staticPromises = {
          day: setup.loadStaticDataForModel(EmberENV.modelPaths.day, staticDayData),
          recipe: setup.loadStaticDataForModel(EmberENV.modelPaths.recipe, staticRecipeData),
          image: setup.loadStaticDataForModel(EmberENV.modelPaths.image, staticImageData),
          settings: setup.get("settings").setup(),
        };

        Ember.RSVP.hash(staticPromises).then(function() {
          setup.checkForUpdates().then(function() {
            setup.get("cognito").startSession();
            setup.get("facebook").setup();
            resolve();
          });
        });
      });
    });
  }

});

export default setupService;
