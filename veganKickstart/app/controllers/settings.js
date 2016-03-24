import Ember from 'ember';

export default Ember.Controller.extend({
  settings: Ember.inject.service('settings'),
  cognito: Ember.inject.service('cognito'),
  dateHelper: Ember.inject.service('date-functions'),
  showBackButton: 'always',

  /**
   * function to return a range of numbers for generating the select list
   */
  allDays: function() {
    return Array.apply(null, new Array(21)).map(function (_, i) {return i + 1;});
  }.property(),

  today: function() {
    var started = this.get("settings").load("startedKickstarter");
    var now = new Date();
    if(started) {
      var startedDate = new Date(started);
      return this.get("dateHelper").daysBetween(startedDate, now);
    } else {
      var todaysDate = this.get("dateHelper").formatDate(now);
      this.get("settings").save("startedKickstarter", todaysDate);
      return 1;
    }
  }.property(),

  //This observer runs to update the day in the settings.
  updateDay: function() {
    var started = this.get("dateHelper").daysAgo(parseInt(this.get("today")) - 1);
    var startedDate = this.get("dateHelper").formatDate(started);
    this.get("settings").save("startedKickstarter", startedDate);
  }.observes("today"),

  init: function() {},
  actions: {
    facebookLogin: function() {
      var that = this;
      this.get("cognito").facebookLogin().then(function() {
          //I don't think we need to do anything here.
        },
        function(error) {
          //Let the user know we weren't able to log them in?
          this.send("openModal", ts("facebook-login-error", error), ts("Error"), {type: "error"});
        }
      );
    },
    facebookLogout: function() {
      this.get("cognito").logout();
    }
  }
});