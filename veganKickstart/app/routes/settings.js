import Ember from 'ember';

export default Ember.Route.extend({
  analytics: Ember.inject.service('analytics'),
  afterModel: function() {
    if(this.controller) {
      this.controller.updateToday();
    }
  },
  actions: {
    didTransition: function() {
      this.get('analytics').logPageView(this);
      return true;
    }
  }
});
