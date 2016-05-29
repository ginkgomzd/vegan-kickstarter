import Ember from 'ember';
import strings from '../data/strings/es';

var translationService = Ember.Service.extend({
  language: "es",
  setup: function() {
    if(!window.ts) {
      var service = this;
      window.ts = function(key, string) {
        if(key && strings.hasOwnProperty(key)) {
          return strings[key];
        } else if(key && strings.hasOwnProperty(key.toLowerCase())) {
          return strings[key.toLowerCase()];
        } else if(string) {
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
