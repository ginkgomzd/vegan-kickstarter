import Ember from 'ember';

var debugService = Ember.Service.extend({
  log: function(msg) {
    if ((EmberENV.environment === 'development')) {
      var dateNow = new Date();
      var timestamp = dateNow.getHours()+':'+dateNow.getMinutes()+':'+dateNow.getSeconds()+':'+dateNow.getMilliseconds();
      console.log('DEBUG-GSL:', timestamp, msg);
    }
  }
});

export default debugService;
