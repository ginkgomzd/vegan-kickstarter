import Ember from 'ember';

export default Ember.Route.extend({
  vka: Ember.inject.service('vka'),
  analytics: Ember.inject.service('analytics'),
  beforeModel: function (params) {
    var today = this.get("vka").getToday();
    this.transitionTo("day", {"queryParams": {"currentDay": today}});
  },
  actions: {
    didTransition: function() {
      this.get('analytics').logPageView(this);
      return true;
    },
  }
});
