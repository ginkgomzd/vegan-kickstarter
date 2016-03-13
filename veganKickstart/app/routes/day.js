import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      "days": this.get("store").findAll("day"),
      "firstSlide": parseInt(params.index) - 1
    });
  }
});