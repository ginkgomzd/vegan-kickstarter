import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  instructions: DS.attr('string'),
  mealType: DS.attr('string'),
  ingredients: DS.attr('string'),
  nutrition: DS.attr('string'),
  tags: DS.attr(),
  images: DS.attr()
});
