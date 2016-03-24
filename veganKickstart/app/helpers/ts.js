import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  return ts(params[0], params[1]);
});