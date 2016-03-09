import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['imageWidget'],
  didInsertElement: function didInsertElement() {
    this.$(".slick-list").css("height", "auto");
  }
});
