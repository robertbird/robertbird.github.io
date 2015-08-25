module.exports = {    
  build: {
    options: {
        sourceMap: true
      },
      files: {
        'js/generated.min.js': [
            'js/jquery-1.7.2.min.js',
            'js/jquery.prettyPhoto.js',
            'js/selectnav.js',
            'js/jquery.ui.totop.js',
            'js/jflickrfeed.min.js',
            'js/twitter-flickr-options.js',
            'js/custom.js'
        ]
      }
  }
}