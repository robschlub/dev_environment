const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-unresolved

const envs = {
  prod: {
    name: 'production',
    uglify: true,
    webpackMode: 'production',
    devtool: false,
    uglifySourceMap: false,
  },
  stage: {
    name: 'stage',
    uglify: true,
    webpackMode: 'production',
    devtool: 'source-map',
    uglifySourceMap: true,
  },
  dev: {
    name: 'dev',
    uglify: false,
    webpackMode: 'development',
    devtool: 'source-map',
    uglifySourceMap: false,
  },
};

const e = envs.dev;
console.log(`Building for ${e.name}`); // eslint-disable-line no-console

const uglify = e.uglify ?
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
    sourceMap: e.uglifySourceMap,
  })
  : '';

const pluginArray = [uglify].filter(elem => elem !== '');

const config = {
  entry: './shared/app/app/static/src/main.js',
  output: {
    path: path.resolve(__dirname, 'shared', 'app', 'app', 'static', 'build'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: pluginArray,
  mode: e.webpackMode,
  devtool: e.devtool,
};

module.exports = config;
