import Ember from 'ember';
import ajax from 'ic-ajax';

var cmsUtils = Ember.Service.extend({
  store: Ember.inject.service('store'),
  settings: Ember.inject.service('settings'),
  isServiceFactory: true,
  indexes: {},
  baseUrl: function() { return EmberENV.cmsUrl; },
  baseAPIPath: function() {return EmberENV.cmsApiPath || 'api';},

  updateIndex: function(indexName, id, oldValues, newValues) {
    //Make sure that both lists of values are actually lists(arrays)
    if (typeof(oldValues) === "string") {
      oldValues = [oldValues];
    }

    if (typeof(newValues) === "string") {
      newValues = [newValues];
    }

    //only update if the values are different
    if(oldValues != newValues) {
      if(this.indexes.hasOwnProperty[indexName]) {
        this.indexes[indexName].modified = true;

        //Remove all references that aren't in the new index.
        for(var i in oldValues) {
          if(oldValues.hasOwnProperty(i) && newValues.indexOf(oldValues[i]) === -1) {
            //remove id from this one.
            var locInd = this.indexes[indexName].index[indexName].records[oldValues[i]].indexOf(id);
            if(locInd !== -1) {
              this.indexes[indexName].index[indexName].records[oldValues[i]].splice(locInd, 1);
            }
          }
        }

        //Add any new references
        for(var x in newValues) {
          if(newValues.hasOwnProperty(x)) {
            if (this.indexes[indexName].index[indexName].records[newValues[x]].indexOf(id) === -1) {
              this.indexes[indexName].index[indexName].records[newValues[x]].push(id);
            }
          }
        }

      }
    }
  },

  loadIndex: function(mapping) {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      localforage.getItem(mapping.emberDataNamespace, function (err, value) {
        if(value && value.hasOwnProperty(mapping.modelName)) {
          that.indexes[mapping.modelName] = {modified: false, index: value, emberDataNamespace: mapping.emberDataNamespace};
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  saveIndexes: function() {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var promises = [];
      for(var i in that.indexes) {
        if(that.indexes.hasOwnProperty(i) && that.indexes[i].modified) {
          promises.push(localforage.setItem(that.indexes[i].emberDataNamespace, that.indexes[i].index));
        }
      }
      Ember.RSVP.all(promises).then(function() {
        resolve(true);
      });
    });
  },

  fetchUpdatedContent: function(modelMapping, lastUpdated) {
    var store = this.get("store");
    var thisService = this;
    var url = this.baseUrl() + "/"+ this.baseAPIPath() +"/" + modelMapping.apiPath + "?updated=" + lastUpdated;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      ajax(url).then(function (results) {
        if(results.length > 0) {
          localforage.getItem(modelMapping.emberDataNamespace, function (err, value) {

            if (!value) {
              value = {};
            }

            if (!value.hasOwnProperty(modelMapping.modelName)) {
              value[modelMapping.modelName] = {records: {}};
            }

            results.forEach(function (item) {
              if (typeof thisService[modelMapping.modelName + "Details"] === "function") {
                thisService[modelMapping.modelName + "Details"](item, value[modelMapping.modelName].records[item.id]);
              }
              if (value[modelMapping.modelName].records.hasOwnProperty(item.id)) {
                for (var prop in item) {
                  if (item.hasOwnProperty(prop)) {
                    value[modelMapping.modelName].records[item.id][prop] = item[prop];
                  }
                }
              } else {
                value[modelMapping.modelName].records[item.id] = item;
              }
            });

            localforage.setItem(modelMapping.emberDataNamespace, value).then(function () {
              resolve(results.length);
            });
          });
        } else {
          resolve([]);
        }
      }, function(error) {
        reject(error);
      });
    });
  },
  updateAll: function(lastUpdated) {
    var that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {

      var indexes = {};

      Ember.RSVP.hash(indexes).then(function(updated) {

        var promises = {};

        for(var m in EmberENV.modelPaths) {
          if(EmberENV.modelPaths.hasOwnProperty(m) && EmberENV.modelPaths[m].apiPath) {
            promises[EmberENV.modelPaths[m].modelName] = that.fetchUpdatedContent(EmberENV.modelPaths[m], lastUpdated);
          }
        }

        Ember.RSVP.hash(promises).then(function(updated) {
          that.saveIndexes().then(function() {
            resolve(updated);
          });
        });
      });
    });
  }
});

export default cmsUtils;
