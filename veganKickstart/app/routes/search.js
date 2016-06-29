import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    query: {
      replace: true
    }
  },
  model: function (params) {
    return this.get("store").findAll("recipe");
  }
});