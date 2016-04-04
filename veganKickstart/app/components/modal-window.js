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
  defaults: {
    showClose: true,
    clickToDismiss: false,
    type: ""
  },
  actions: {
    toggleModal: function() {
      this.toggleProperty('enabled');
    },
    showModal: function(message, title, params) {
      this.set("message", message);
      this.set("title", title);

      params = params || {};

      var type = params.type || this.defaults.type;
      this.set("type", type);

      var clickToDismiss = params.clickToDismiss || this.defaults.clickToDismiss;
      this.set("clickToDismiss", clickToDismiss);

      var showClose = params.showClose || this.defaults.showClose;
      this.set("showClose", showClose);

      if (params.timeout) {
        var that = this;
        Ember.run.later(function () {
          that.send("hideModal", false);
        }, params.timeout);
      }

      this.set("enabled", true);
    },
    hideModal: function() {
      this.set("enabled", false);
    },
    clickToDismiss: function() {
      if (this.get("clickToDismiss")) {
        this.send("hideModal");
      }
    }
  },
  expose: function() {
    var app_controller = this.get('targetObject');
    var exposedName = "comp-" + this.get('id');
    app_controller.set(exposedName, this);

    //Set some defaults
    this.defaults.clickToDismiss = this.get("clickToDismiss") || this.defaults.clickToDismiss;
    this.defaults.type = this.get("type") || this.defaults.type;
    this.defaults.showClose = this.get("showClose") || this.defaults.showClose;
  }.on('init')
});