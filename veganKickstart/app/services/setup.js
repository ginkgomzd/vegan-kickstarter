import Ember from 'ember';
/*** [  Data is exported from CMS and any changes should be reflected there.  ] ***/
import staticAlumniData from '../data/alumni';
import staticClusterData from '../data/clusters';
import staticOccupationData from '../data/occupations';
import staticOnetCareerData from '../data/onetCareers';
import staticPathwayData from '../data/pathways';
import staticProgramData from '../data/programs';
import staticQuestionData from '../data/questions';
import staticQuestionOptionData from '../data/questionOptions';
import expectedEntityCounts from '../data/entities';
import staticCollegeData from '../data/colleges';
import staticZipData from '../data/zipcodes';
import staticProgramCollegeIndex from '../data/programCollegeIndex';
import staticProgramOccupationIndex from '../data/programOccupationIndex';


var setupService = Ember.Object.extend({
  store: Ember.inject.service('store'),
  settings: Ember.inject.service('settings'),
  profilerDataUtils: Ember.inject.service('profilerDataUtils'),
  cmsUtils: Ember.inject.service('cmsUtils'),
  checkForUpdates: function() {
    var setup = this;
    //Calculate the last updated date
    var lastUpdated = this.get("settings").load("lastUpdatedDate");
    if (!lastUpdated) {
      lastUpdated = EmberENV.staticDataUpdatedDate;
    }

    return new Ember.RSVP.Promise(function(resolve, reject) {
      setup.get("cmsUtils").updateAll(lastUpdated).then(function(updated) {
        var today = new Date();
        setup.get("settings").save("lastUpdatedDate", today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
        resolve(true);
      }, function() {
        resolve(false);
      });
    });

  },
  "onet-careerDefaults": function(item) {
    item.score = 0;
  },
  pathwayDefaults: function(item) {
    item.bookmarked = false;
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

  loadStaticIndex: function(modelInfo, staticData) {
    var setup = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      localforage.getItem(modelInfo.emberDataNamespace, function (err, value) {

        if (!value) {
          value = {};
        }

        if(!value.hasOwnProperty(modelInfo.modelName) || !value[modelInfo.modelName].hasOwnProperty("records")) {
          value[modelInfo.modelName] = {};
          value[modelInfo.modelName].records = staticData;
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
    return new Ember.RSVP.Promise(function(resolve, reject) {
      setup.get("profilerDataUtils").loadAllUserDataFromParse().then(function (userData) {
        setup.preloadModels().then(function() {
          resolve();
        });
      });
    });
  },
  preloadModels: function() {
    var setup = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {

      //Here we flush the adapter cache so any changes made by setup will show up.
      var appAdapter = setup.get("store").adapterFor("application");
      appAdapter.flushCache(EmberENV.modelPaths["onet-career"].modelName);
      appAdapter.flushCache(EmberENV.modelPaths.cluster.modelName);
      appAdapter.flushCache(EmberENV.modelPaths.pathway.modelName);

      var promises = [
        setup.get("store").findAll("onet-career"),
        setup.get("store").findAll("cluster"),
        setup.get("store").findAll("pathway")
      ];

      Ember.RSVP.all(promises).then(function() {
        resolve();
      });
    });
  },
  appStartup: function() {
    var setup = this;
    //console.log(this.get("store").unloadAll());
    return new Ember.RSVP.Promise(function(resolve, reject) {
      setup.validateDatabaseVersion().then(function(fetchUserData) {

        var staticPromises = {
          question: setup.loadStaticDataForModel(EmberENV.modelPaths.question, staticQuestionData),
          questionOption: setup.loadStaticDataForModel(EmberENV.modelPaths["question-option"], staticQuestionOptionData),
          cluster: setup.loadStaticDataForModel(EmberENV.modelPaths.cluster, staticClusterData),
          pathway: setup.loadStaticDataForModel(EmberENV.modelPaths.pathway, staticPathwayData),
          onetCareer: setup.loadStaticDataForModel(EmberENV.modelPaths["onet-career"], staticOnetCareerData),
          occupation: setup.loadStaticDataForModel(EmberENV.modelPaths.occupation, staticOccupationData),
          alumni: setup.loadStaticDataForModel(EmberENV.modelPaths.alumni, staticAlumniData),
          college: setup.loadStaticDataForModel(EmberENV.modelPaths.college, staticCollegeData),
          program: setup.loadStaticDataForModel(EmberENV.modelPaths.program, staticProgramData),
          zipcode: setup.loadStaticDataForModel(EmberENV.modelPaths.zipcode, staticZipData),
          settings: setup.get("settings").setup(),
          collegeIndex: setup.loadStaticIndex(EmberENV.modelPaths.collegeIndex, staticProgramCollegeIndex),
          occupationIndex: setup.loadStaticIndex(EmberENV.modelPaths.occupationIndex, staticProgramOccupationIndex)
        };

        Ember.RSVP.hash(staticPromises).then(function() {
          setup.checkForUpdates().then(function() {
            if(fetchUserData) {
              setup.get("profilerDataUtils").loadAllUserDataFromParse().then(function(userData) {
                setup.preloadModels().then(function() {
                  resolve();
                });
              });
            } else {
              setup.preloadModels().then(function() {
                resolve();
              });
            }
          });
        });
      });
    });
  }

});

export default setupService;
