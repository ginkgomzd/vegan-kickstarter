import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  if(params.length > 1) {
    return params[1];
  } else {
    if (params[0]) {
      return params[0].charAt(0).toUpperCase() + params[0].slice(1);
    } else {
      return "";
    }
  }
});