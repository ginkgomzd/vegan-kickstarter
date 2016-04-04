import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ["glyphicon", "favorite", "right", "clickable"],
  classNameBindings: ["model.favorite:glyphicon-star:glyphicon-star-empty", "model.favorite:favorite-saved"],
  click: function() {
    this.get("model").toggleProperty("favorite");
    this.get("model").save();
  }
});
