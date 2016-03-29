import Ember from 'ember';

export default Ember.Controller.extend(Ember.Evented, {
  orientationServices: Ember.inject.service('orientation'),
  showBackButton: 'never',
  init: function() {
    this.get("orientationServices").registerCallback("day", "resize", this);
    return this._super();
  },
  willDestroy: function() {
    this.get("orientationServices").removeCallback("day");
    return this._super();
  },
  firstSlide: function() {
    return this.get("model").firstSlide;
  }.property("model"),

  actions: {
    slickInit: function(obj) {
      this.send("resize");
      Ember.$(obj).find(".slick-list").css({"height": "100%", "width": "100%"});
    },
    viewRecipe: function(recipe) {
      this.transitionToRoute("recipe", recipe);
    },
    beforeSlideChange: function(slick, currentSlide, nextSlide) {
      console.log(currentSlide, nextSlide);
      if(currentSlide !== nextSlide && !isNaN(currentSlide)) {
        this.set("firstSlide", currentSlide);
        this.set("changing", true);
      }
    },
    afterSlideChange: function() {
      if(this.changing) {
        Ember.$('#day-view').animate({scrollTop: 0}, 300);
        this.set("changing", false);
      }
    },
    reachedEdge: function(slick, direction) {

    },
    resize: function() {
      var top = Ember.$(".main-nav").outerHeight();
      Ember.$("#day-view").height(window.innerHeight - top);
    }
  }
});
