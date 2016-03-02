import DS from 'ember-data';

export default DS.Model.extend({
  number: DS.attr('number'),
  recipes: DS.hasMany('recipe'),
  messageTitle: DS.attr('string'),
  messageBody: DS.attr('string'),
  messageAuthor: DS.attr('string'),
  images: DS.attr()
});
