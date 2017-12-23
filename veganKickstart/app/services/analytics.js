import Ember from 'ember';

var analyticsService = Ember.Service.extend({
  firebase: Ember.inject.service('firebase'),
  debug: Ember.inject.service('debug'),

  logPageView: function(route) {
    var svcFirebase = this.get('firebase');
    var svcDebug = this.get('debug');
    var msgPrefix = 'analyticsService::logPageView';

    if (route.routeName === 'application') {
      return true; // invalid hit
    }
    svcDebug.log(msgPrefix);

    var params = {
      vka_page_type: route.routeName,
    };
    svcDebug.log(msgPrefix+'::vka_page_type::'+params.vka_page_type);


    var context = route.context;
    var controller = route.get('controller');
    var model = controller.get('model');

    // console.dir(route);
    // console.dir(controller);

    if (route.routeName === 'day') {
      params.current_day = controller.currentDay;
      svcDebug.log(msgPrefix+'::params.current_day::'+params.current_day);
    }

    if (route.routeName === 'recipe') {
      params.recipe_name = model.get('name');
      svcDebug.log(msgPrefix+'::params.recipe_name::'+params.recipe_name);
      params.recipe_url = decodeURIComponent(
        model.get('url').replace('https://vegetarianoen21diasapp.com','')
      );
      svcDebug.log(msgPrefix+'::params.recipe_url::'+params.recipe_url);
      var isFavorite = model.get('favorite');
      if (isFavorite) {
        params.recipe_favorited = true;
        svcDebug.log(msgPrefix+'::params.recipe_favorited::'+params.recipe_favorited);
      }
    }

    svcFirebase.plugin.logEvent('vka_page_view', params);

    return true;
  },
  logClick: function(event) {
    var svcFirebase = this.get('firebase');
    var svcDebug = this.get('debug');
    var msgPrefix = 'analyticsService::logClick';
    svcDebug.log(msgPrefix);

    var el = event.toElement;

    var params = {};
    this.createForTruthyProperty(params, 'class_name', el, 'className');
    this.createForTruthyProperty(params, 'tag_name', el, 'tagName');
    this.createForTruthyProperty(params, 'title', el, 'title');

    // TODO: smoosh these to meaningufl strings:
    // this.createForTruthyProperty(params, 'parent_element', el, 'parentElement');
    // this.createForTruthyProperty(params, 'next_sibling', el, 'nextSibling');
    // this.createForTruthyProperty(params, 'previous_sibling', el, 'previousSibling');
    // this.createForTruthyProperty(params, 'first_child', el, 'firstChild');

    svcFirebase.plugin.logEvent('vka_click', params);

    if (params.class_name && params.class_name.indexOf('share-widget') != -1) {
      this.logShare();
    }
  },
  logShare: function() {
    var svcFirebase = this.get('firebase');
    var svcDebug = this.get('debug');
    var msgPrefix = 'analyticsService::logShare';
    svcDebug.log(msgPrefix);

    var params = {
      timestamp: Date.now()
    }

    svcFirebase.plugin.logEvent('vka_share_click', params);
  },
  logFavorite: function(recipe) {
    var svcFirebase = this.get('firebase');
    var svcDebug = this.get('debug');
    var msgPrefix = 'analyticsService::logFavorite';

    var isFav = recipe.get('favorite');

    if (!isFav) {
      return;
    }
    var params = {
      timestamp: Date.now(),
      recipe_name: recipe.get('name'),
      recipe_url: decodeURIComponent(
        recipe.get('url').replace('https://vegetarianoen21diasapp.com','')
      ),
    };

    svcDebug.log(msgPrefix);
    svcFirebase.plugin.logEvent('vka_favorite_recipe', params);
  },
  createForTruthyProperty: function(target, name, object, property) {
    if (object[property]) {
      target[name] = object[property];
    }
  }
});

export default analyticsService;
