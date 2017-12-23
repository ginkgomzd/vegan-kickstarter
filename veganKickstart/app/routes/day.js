import Ember from 'ember';

export default Ember.Route.extend({
  vka: Ember.inject.service('vka'),
  analytics: Ember.inject.service('analytics'),
  queryParams: {
    currentDay: {
      replace: true
    }
  },
  model: function () {
    if (this.controller) {
      this.controller.updateShowDay22();
    }
    return Ember.RSVP.hash({
      "days": this.get("store").findAll("day"),
      "today": this.get("vka").getToday()
    });
  }
});