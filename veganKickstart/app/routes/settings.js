import Ember from 'ember';

export default Ember.Route.extend({
  facebook: Ember.inject.service('facebook'),

  model: function (params) {
    var facebook = this.get("facebook");
    return new Ember.RSVP.Promise(function (resolve, reject) {
      facebook.loginStatus().then(function(status) {
        var success = (status === "connected");
        resolve({loggedin: success});
      }, function() {
        resolve({loggedin: false});
      });
    });
  }
});