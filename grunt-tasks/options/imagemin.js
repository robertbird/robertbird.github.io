module.exports = {
  dynamic: {
    files: [{
      expand: true,
      cwd: 'assets/',
      src: ['**/*.{png,jpg,gif}'],
      dest: 'assets/'
    }]
  }
}