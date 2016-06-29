import Ember from 'ember';

export default Ember.Controller.extend(Ember.Evented, {
  orientationServices: Ember.inject.service('orientation'),
  showBackButton: 'never',
  queryParams: ['currentDay'],
  onLoad: function() {
    this.get("orientationServices").registerCallback("day", "resize", this);
  }.on("init"),
  willDestroy: function() {
    this.get("orientationServices").removeCallback("day");
    return this._super();
  },
  currentDay: 1,
  // Days are 1-indexed while slides are 0-indexed; hence the math below
  currentSlide: function() { return this.get("currentDay") - 1; }.property(),
  /**
   * We are doing this in a slightly unconventional way, as normally you can
   * pass in an observer to property(), but in this instance, it doesn't seem
   * to trigger properly, while observes() does.
   */
  watchCurrentDay: function() {this.set("currentSlide", this.get("currentDay") - 1);}.observes("currentDay"),
  actions: {
    slickInit: function(obj) {
      this.send("resize");
      Ember.$(obj).find(".slick-list").css({"height": "100%", "width": "100%"});
    },
    viewRecipe: function(recipe) {
      this.transitionToRoute("recipe", recipe);
    },
    beforeSlideChange: function(slick, currentSlide, nextSlide) {
      if(currentSlide !== nextSlide && !isNaN(currentSlide)) {
        this.set("changing", true);
      }
    },
    afterSlideChange: function(slick, slide) {
      if(this.changing) {
        // Days are 1-indexed while slides are 0-indexed; hence the math below
        this.set("currentDay", slide + 1);
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
