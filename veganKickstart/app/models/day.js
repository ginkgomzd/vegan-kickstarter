import DS from 'ember-data';

export default DS.Model.extend({
  recipes: DS.hasMany('recipe'),
  messageTitle: DS.attr('string'),
  messageBody: DS.attr('string'),
  image: DS.belongsTo("image")
});
