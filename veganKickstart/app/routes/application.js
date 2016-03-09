import Ember from 'ember';

export default Ember.Route.extend({
  setupUtils: Ember.inject.service('setup'),
  model: function () {
    return this.get("setupUtils").appStartup();
  },
  afterModel: function(transition) {
    //This is where we will calculate which day should be shown
    this.transitionTo("day", 1);
  }
});