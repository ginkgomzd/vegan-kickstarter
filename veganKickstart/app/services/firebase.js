import Ember from 'ember';

var firebase = Ember.Service.extend({
  init: function() {
    this._super();
    this.plugin = window.FirebasePlugin;
  },
  plugin: {}
});

export default firebase;
