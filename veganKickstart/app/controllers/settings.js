import Ember from 'ember';

export default Ember.Controller.extend({
  showBackButton: 'never',

  allDays: function() {
    return Array.apply(null, new Array(21)).map(function (_, i) {return i + 1;});
  }.property(),

  init: function() {},
  actions: {
    changeDay: function() {

    }
  }
});