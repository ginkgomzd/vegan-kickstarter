import Ember from 'ember';

var translationService = Ember.Service.extend({
  language: "es",
  init: function() {
    if(!window.ts) {
      var service = this;
      window.ts = function(key, string) {
        if(string) {
          return string;
        } else {
          key = key || "";
          return key.charAt(0).toUpperCase() + key.slice(1);
        }
      };
    }
  }
});

export default translationService;
