import Ember from 'ember';

export default Ember.Controller.extend(Ember.Evented, {
  showBackButton: 'never',
  firstSlide: function() {
    return this.get("model").firstSlide;
  }.property("model"),

  actions: {
    slickInit: function(obj) {
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
        Ember.$('body,html').animate({scrollTop: 0}, 300);
        this.set("changing", false);
      }
    },
    reachedEdge: function(slick, direction) {

    }
  }
});
