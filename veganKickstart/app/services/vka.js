import Ember from 'ember';

var vkaServices = Ember.Service.extend({
  settings: Ember.inject.service('settings'),
  dateHelper: Ember.inject.service('date-functions'),
  getToday: function() {
    //This is where we will calculate which day should be shown
    var startedDateString = this.get("settings").load("startedKickstarter");
    var day;

    if (startedDateString) {
      var started = new Date(startedDateString);
      day = this.get("dateHelper").daysBetween(started) + 1;
    } else {
      this.get("settings").save("startedKickstarter", this.get("dateHelper").formatDate());
      day = 1;
    }

    if (day === "Invalid Date" || isNaN(day)) {
      return 1;

    } else if (day > 21) {
      return 22;
    } else {
      return day;
    }
  },
  startOver: function() {
    this.get("settings").save("startedKickstarter", this.get("dateHelper").formatDate());
  }
});

export default vkaServices;