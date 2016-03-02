/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'vegan-kickstart',
    environment: environment,
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      modelPaths: {
        day: {modelName: "day", apiPath: "days", emberDataNamespace: "VKADays"},
        recipe: {modelName: "recipe", apiPath: "recipes", emberDataNamespace: "VKARecipes"},
        setting: {modelName: "setting", apiPath: "", emberDataNamespace: "VKASettings"},
        //favorite: {modelName: "setting", apiPath: "", emberDataNamespace: "VKASettings"}
      },
      databaseVersion: 0.1,
      staticDataUpdatedDate: "2016-3-1",
      cmsUrl: "http://sandbox.vegetarianoen21diasapp.com"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
