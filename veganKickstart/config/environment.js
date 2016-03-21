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
        image: {modelName: "image", apiPath: "images", emberDataNamespace: "VKAImages"},
        setting: {modelName: "setting", apiPath: "", emberDataNamespace: "VKASettings"},
        //favorite: {modelName: "setting", apiPath: "", emberDataNamespace: "VKASettings"}
      },
      databaseVersion: 0.1,
      staticDataUpdatedDate: "2016-2-1",
      cmsUrl: "https://vegetarianoen21diasapp.com",
      cmsApiPath: "api",
      facebookAppID: "1661929367400739",
      AWS: {
        CognitoRegion: "us-east-1",
        CognitoIdentityPool: "b9bd02de-c3c9-45eb-bef5-c97db8a010f3",
        CognitoDataset: "VKA-UserData"
      },
      GCMSenderID: "155595325949"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicyMeta: true,
    contentSecurityPolicy: {
      'default-src': ["'self'", "https://vegetarianoen21diasapp.com"],

      // Allow scripts from:
      'script-src': ["'self'", "https://connect.facebook.net"],

      'font-src': ["'self'", "http://fonts.gstatic.com"],

      // Allow data (ajax/websocket) from:
      'connect-src': ["'self'", "https://vegetarianoen21diasapp.com"],

      // Allow images from the origin itself (i.e. current domain)
      'img-src': ["'self'", "data:", "https://*.facebook.com"],

      'style-src': ["'self'", "'unsafe-inline'"],

      'frame-src': ["'self'", "*.facebook.com"],

      'media-src': null
    }
  };




  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    //ENV.EmberENV.cmsUrl = "http://sandbox.vegetarianoen21diasapp.com";
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
