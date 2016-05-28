import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ["glyphicon", "favorite", "right", "clickable", "glyphicon-share", "share-widget"],
  classNameBindings: ["window.plugins.socialsharing:enabled:disabled"],
  click: function() {
    if (window.plugins && window.plugins.socialsharing) {
      var options = {
        message: model.url, // not supported on some apps (Facebook, Instagram)
        subject: model.name, // fi. for email
        files: [] // an array of filenames either locally or remotely
        //url: 'https://www.website.com/foo/#bar?a=b',
        //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
      };

      window.plugins.socialsharing.shareWithOptions(options);
    }
  }
});
