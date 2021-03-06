import Ember from 'ember';

export default Ember.Route.extend({
  analytics: Ember.inject.service('analytics'),
  model: function (params) {
    return this.get("store").find("recipe", params.index);
  },
  actions: {
    didTransition: function() {
      this.get('analytics').logPageView(this);
      return true;
    },
  }
});
