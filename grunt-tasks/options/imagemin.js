module.exports = {
  dynamic: {
    files: [{
      expand: true,
      cwd: 'assets/',
      src: ['**/*.{png,jpg,gif}'],
      dest: 'assets/',
        optimizationLevel : 6
    }]
  },
  template: {
    files: [{
      expand: true,
      cwd: 'images/',
      src: ['**/*.{png,jpg,gif}'],
      dest: 'images/'
    }]
  }
}