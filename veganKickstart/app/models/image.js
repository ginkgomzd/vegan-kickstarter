import DS from 'ember-data';

export default DS.Model.extend({
  mimeType: DS.attr('string'),
  path: DS.attr('string'),
  imageData: DS.attr('string')
});