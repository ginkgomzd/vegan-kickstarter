import Ember from 'ember';

export default Ember.Component.extend({
  title: function() {
    return "";
  }.property(),
  message: function() {
    return "";
  }.property(),
  type: function() {
    return "";
  }.property(),
  enabled: function() {
    return false;
  }.property(),
  actions: {
    toggleModal: function() {
      this.toggleProperty('enabled');
    },
    showModal: function(message, title, type, timeout) {
      this.set("message", message);
      this.set("title", title);
      this.set("type", type);
      this.set("enabled", true);
      if (timeout) {
        var that = this;
        Ember.run.later(function() {
          that.send("hideModal", false);
        }, timeout);
      }
    },
    hideModal: function() {
      this.set("enabled", false);
    }
  },
  expose: function() {
    var app_controller = this.get('targetObject');
    var exposedName = "comp-" + this.get('id');
    app_controller.set(exposedName, this);
  }.on('init')
});