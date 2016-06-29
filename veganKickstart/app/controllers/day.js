import Ember from 'ember';

export default Ember.Controller.extend(Ember.Evented, {
  settings: Ember.inject.service('settings'),
  orientationServices: Ember.inject.service('orientation'),
  vka: Ember.inject.service('vka'),
  showBackButton: 'never',
  queryParams: ['currentDay'],
  onLoad: function() {
    this.get("orientationServices").registerCallback("day", "resize", this);
    //Add an event listener to catch resume from background mode
    var that = this;
    document.addEventListener("resume", function(event) {
      if (that) {
        that.handleAppResume();
      }
    }, false);
  }.on("init"),
  willDestroy: function() {
    this.get("orientationServices").removeCallback("day");
    return this._super();
  },
  today: function() { return this.get("vka").getToday();},
  currentDay: 1,
  // Days are 1-indexed while slides are 0-indexed; hence the math below
  currentSlide: function() { return this.get("currentDay") - 1; }.property(),
  /**
   * We are doing this in a slightly unconventional way, as normally you can
   * pass in an observer to property(), but in this instance, it doesn't seem
   * to trigger properly, while observes() does.
   */
  watchCurrentDay: function() {this.set("currentSlide", this.get("currentDay") - 1);}.observes("currentDay"),
  /**
   * This function is called when the app is resumed,
   * eg, brought back from sleeping/background mode.
   * It checks if the day has changed and moves the app
   * forward when that has taken place.
   */
  handleAppResume: function() {
    var today = this.get("vka").getToday();
    if (this.get("today") !== today) {
      this.set("currentDay", today);
      //This is so that the reference updates and we don't end up
      // bouncing the user back to today if "today" hasn't changed.
      //eg, after every time they get a phone call.
      this.set("today", today);
    }
  },
  showDay22: function() {
    return (this.get("vka").getToday() > 21);
  }.property("currentDay"),
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
