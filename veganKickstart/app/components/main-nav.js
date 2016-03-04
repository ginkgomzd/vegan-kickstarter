import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ["main-nav", "darkGrayBar"],
  classNameBindings: ["showBackButton:bb-visible:bb-hidden"],
  settings: Ember.inject.service('settings'),
  showBackButton: function() {
    console.log(this.get("settings").get("showBackButton"));
    return this.get("settings").get("showBackButton");
  }.property("settings.showBackButton"),
  actions: {
    backAction: function () {
      this.sendAction("backAction");
    },
    settingsAction: function () {
      this.sendAction("settingsAction");
    }
  }
});
