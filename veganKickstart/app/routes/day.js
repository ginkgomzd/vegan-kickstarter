import Ember from 'ember';

export default Ember.Route.extend({
  vka: Ember.inject.service('vka'),
  queryParams: {
    currentDay: {
      replace: true
    }
  },
  model: function () {
    return Ember.RSVP.hash({
      "days": this.get("store").findAll("day"),
      "today": this.get("vka").getToday()
    });
  }
});