import Ember from 'ember';

export default Ember.Route.extend({
  afterModel: function() {
    if(this.controller) {
      this.controller.updateToday();
    }
  }
});