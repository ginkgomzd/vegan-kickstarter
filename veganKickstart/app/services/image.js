import Ember from 'ember';

var imageService = Ember.Service.extend({
  debug: Ember.inject.service('debug'),
  cacheAndDisplay: function(image) {
    var that = this;
    var debug = this.get('debug');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var url = image.get("remotePath");

      if (!window.cordova) {
        return resolve(url);
      }

      var localFilename = that.makeLocalFilename(image);
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

          // Parameters passed to getFile create a new file or return the file if it already exists.
          fs.root.getFile(localFilename, {create: false, exclusive: false}, function (fileEntry) {
              resolve(fileEntry.toURL());
            },
            //File Does not already exist.
            function(error) {
              //var localPath = fs.root.fullPath + localFilename;
              var localPath = fs.root.nativeURL + localFilename;
              that.fetchImage(url, localPath).then(
                function(imgUrl) {
                  resolve(imgUrl);
                },
                function(error) {
                  debug.log("Error: ", error);
                  resolve(url);
                }
              );
            }
          );

        },
        //Load the FileSystem Error Callback
        function() {
          //Fall back on remote load
          resolve(url);
        }
      );
    });
  },
  makeLocalFilename: function(image) {
    var ext = image.get("mimeType").replace("image/", "");
    return image.get("id") + "." + ext;
  },
  fetchImage: function(url, localPath) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var fileTransfer = new FileTransfer();
      var uri = encodeURI(url);
      fileTransfer.download(
        uri,
        localPath,
        function(entry) { resolve(entry.toURL()); },
        function(error) { reject(error);},
        false, {}
      );
    });
  }
});

export default imageService;
