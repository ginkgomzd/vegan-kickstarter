import Ember from 'ember';

export default Ember.Controller.extend({
  hideBackButton: true,
  actions: {
    executeBackAction: function() {
      window.history.back();
    },
    goToSettings: function() {
      this.transitionToRoute("settings");
    }
  }
});