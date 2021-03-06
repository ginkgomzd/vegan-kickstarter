import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  instructions: DS.attr('string'),
  mealType: DS.attr('string'),
  ingredients: DS.attr('string'),
  nutrition: DS.attr('string'),
  tags: DS.attr(),
  images: DS.hasMany("image"),
  favorite: DS.attr("boolean", {"default": false}),
  url: DS.attr("string")
});
