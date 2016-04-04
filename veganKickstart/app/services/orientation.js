import Ember from 'ember';

var orientationServices = Ember.Service.extend({
  callbacksToFire: [],
  init: function() {
    var that = this;
    var handler = function(event) {
      that.updateOrientation(event);
    };
    window.addEventListener("orientationchange", handler);
    window.addEventListener("resize", handler);
  },
  /**
   * This function will be called on both resize and orientation change
   * As far s I know, a resizze event only takes place on a mobile
   * device on orientation change. Or possibly with the new iPad split
   * screen. But I haven't tested that.
   */
  updateOrientation: function(event) {
    for(var x in this.callbacksToFire) {
      if(this.callbacksToFire.hasOwnProperty(x) && this.callbacksToFire[x]) {
        this.callbacksToFire[x].controller.send(this.callbacksToFire[x].action, event);
      }
    }
  },
  /**
   * Used to register intent to react to orientation change.
   */
  registerCallback: function(name, action, controller) {
    this.callbacksToFire[name] = {"controller": controller, "action": action};
  },
  removeCallback: function(name) {
    if(this.callbacksToFire.hasOwnProperty(name)) {
      delete this.callbacksToFire[name];
    }
  }
});

export default orientationServices;