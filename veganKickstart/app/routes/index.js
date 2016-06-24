import Ember from 'ember';

export default Ember.Route.extend({
  vka: Ember.inject.service('vka'),
  beforeModel: function (params) {
    var today = this.get("vka").getToday();
    this.transitionTo("day", {"queryParams": {"currentDay": today}});
  }
});