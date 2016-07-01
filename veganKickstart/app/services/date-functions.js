import Ember from 'ember';

var dateServices = Ember.Service.extend({

  millisecondsPerDay: 86400000,

  formatDate: function(date) {
    date = date || new Date();
    //the month +1 is to account for javascript getMonth returning a zero-based index
    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
  },

  formatDateTime: function(date) {
    date = date || new Date();
    //the month +1 is to account for javascript getMonth returning a zero-based index
    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
  },

  daysBetween: function(a, b) {
    b = b || new Date();
    a = new Date(this.formatDate(a));
    b = new Date(this.formatDate(b));
    return Math.round(Math.abs(a.getTime() - b.getTime()) / this.millisecondsPerDay);
  },

  daysAgo: function(days, date) {
    var from = date || new Date();
    //This converts "days ago" to a timestring and into a Date object
    return new Date(from.getTime() - (parseInt(days) * this.millisecondsPerDay));
  }


});

export default dateServices;
