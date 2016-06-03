import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ["glyphicon", "favorite", "right", "clickable", "glyphicon-share", "share-widget"],
  classNameBindings: ["enabled:enabled:disabled"],
  enabled: function() {
    return (window.plugins && window.plugins.socialsharing);
  }.property(),
  click: function() {
    if (window.plugins && window.plugins.socialsharing) {

      /*
       * If you include the images Facebook assumes that is all you want to share
       * Other share targets don't support live loading of meta-tags
       * So for now we're just going to leave the images out.
       */
      /*
      var images = [];
      this.get("model").get("images").forEach(function(image) {
        images.push("data:" + image.get("mimeType") + ";base64," + image.get("imageData"));
      });
      */

      window.plugins.socialsharing.share(
        //We're using jquery to strip out html tags here.
        //We're adding the p tags in case the description doesn't have html
        //Because that would cause jQuery to freak out.
        Ember.$("<p>" + this.get("model").get("description") + "</p>").text(),
        this.get("model").get("name"),
        null, //images,
        this.get("model").get("url")
      );
    }
  }
});
