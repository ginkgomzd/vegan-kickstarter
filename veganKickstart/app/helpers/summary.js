import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  var summaryLength = params[1] || 300;
  if (params[0]) {
    if (params[0].length > summaryLength) {
      return params[0].substr(0, summaryLength) + "...";
    } else {
      return params[0];
    }
  } else {
    return "";
  }
});