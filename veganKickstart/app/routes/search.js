import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      "recipes": this.get("store").findAll("recipe"),
      "query": params.query
    });
  }
});