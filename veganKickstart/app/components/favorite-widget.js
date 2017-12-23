import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ["glyphicon", "favorite", "right", "clickable"],
  classNameBindings: ["model.favorite:glyphicon-star:glyphicon-star-empty", "model.favorite:favorite-saved"],
  analytics: Ember.inject.service('analytics'),
  click: function() {
    this.get("model").toggleProperty("favorite");
    this.get("model").save();

    this.get('analytics').logFavorite(this.get('model'));
  }
});
