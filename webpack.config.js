const path = require('path');

const config = {
  entry: './shared/app/app/static/src/test.js',
  output: {
    path: path.resolve(__dirname, 'shared', 'app', 'app', 'static', 'build'),
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
