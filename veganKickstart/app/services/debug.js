import Ember from 'ember';

var debugService = Ember.Service.extend({
  log: function(msg) {
    if ((EmberENV.environment === 'development')) {
      console.log('[DEBUG-GSL]'+msg);
    }
  }
});

export default debugService;
