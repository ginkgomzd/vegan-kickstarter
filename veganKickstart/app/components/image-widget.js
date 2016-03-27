import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['imageWidget'],
  showDecoration: function() {
    return (this.get("decoration") !== false);
  }.property(),
  didInsertElement: function didInsertElement() {
    this.$().find(".slick-list").css("height", "auto");
  }
});
