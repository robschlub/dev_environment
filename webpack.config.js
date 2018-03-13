const path = require('path');

const config = {
  entry: './shared/app/js/src/test.js',
  output: {
    path: path.resolve(__dirname, 'shared', 'app', 'js', 'build'),
    filename: 'main.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader',
      },
    ],
  },
  mode: 'development',
};

module.exports = config;
