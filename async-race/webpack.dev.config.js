const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    watchFiles: ['src/**/*'],
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
  },
};