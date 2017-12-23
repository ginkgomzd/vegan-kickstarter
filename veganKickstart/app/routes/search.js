import Ember from 'ember';

export default Ember.Route.extend({
  analytics: Ember.inject.service('analytics'),
  queryParams: {
    query: {
      replace: true
    }
  },
  model: function (params) {
    return this.get("store").findAll("recipe");
  },
  actions: {
    didTransition: function() {
      this.get('analytics').logPageView(this);
      return true;
    }
  }
});
