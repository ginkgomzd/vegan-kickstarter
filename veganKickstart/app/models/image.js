import DS from 'ember-data';

export default DS.Model.extend({
  mimeType: DS.attr('string'),
  remotePath: DS.attr('string')
});
