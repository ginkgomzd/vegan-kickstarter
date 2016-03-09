import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    if(params.index < 21) {
      return this.get("store").find("day", params.index);
    } else {
      return {error: params.index};
    }
  }
});