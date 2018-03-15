const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-unresolved
const CleanWebpackPlugin = require('clean-webpack-plugin'); // eslint-disable-line import/no-unresolved

const buildPath = path.resolve(__dirname, 'shared', 'app', 'app', 'static', 'build');

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

const e = envs.prod;
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
const clean = new CleanWebpackPlugin([buildPath]);

const pluginArray = [
  uglify,
  clean].filter(elem => elem !== '');

const config = {
  entry: {
    main: './shared/app/app/static/src/main.js',
    entry2: './shared/app/app/static/src/entry2.js',
    entry3: './shared/app/app/static/src/entry3.js',
  },
  output: {
    path: buildPath,
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
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        tools: {
          minSize: 10,
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: true,
          test: /src\/tools/,
          name: 'tools',
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
  },
};

module.exports = config;
