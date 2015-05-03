module.exports = {
  options: {
    browsers: ['last 2 version']
  },
  multiple_files: {
    expand: true,
    flatten: true,
    src: 'css/test/*.css',
    dest: 'css/prefixed/'
  }
}