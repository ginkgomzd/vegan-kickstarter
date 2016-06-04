import Ember from 'ember';

var statusService = Ember.Service.extend({

  loading: function(msg, duration, dismiss, title) {
    if (window.plugins && window.plugins.spinnerDialog) {
      dismiss = dismiss || true;
      window.plugins.spinnerDialog.show(title, msg, dismiss);
      if (duration && duration > 0) {
        setTimeout(this.complete, duration);
      }
    }
  },
  complete: function() {
    if (window.plugins && window.plugins.spinnerDialog) {
      window.plugins.spinnerDialog.hide();
    }
  }

});

export default statusService;
