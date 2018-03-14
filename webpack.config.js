const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-unresolved

const config = {
  entry: './shared/app/app/static/src/test.js',
  output: {
    path: path.resolve(__dirname, 'shared', 'app', 'app', 'static', 'build'),
    filename: 'main.bundle.js',
  },
  // resolve: {
  //   modules: ['/app/node_modules', 'node_modules'],
  // },
  // resolveLoader: {
  //   modules: ['/app/node_modules', 'node_modules'],
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 8,
        warnings: false,
        // parse: { ...options },
        // compress: { ...options },
        // mangle: {
        //   ...options,
        //   properties: {
        //     // mangle property options
        //   },
        // },
        output: {
          comments: false,
          beautify: false,
          // ...options
        },
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
      },
    }),
  ],
  mode: 'development', // Make this production to remove eval statements from bundle output
};

module.exports = config;
