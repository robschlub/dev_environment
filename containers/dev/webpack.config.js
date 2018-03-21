const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-unresolved
const CleanWebpackPlugin = require('clean-webpack-plugin'); // eslint-disable-line import/no-unresolved
const webpack = require('webpack'); // eslint-disable-line import/no-unresolved

const buildPath = path.resolve(__dirname, 'app', 'app', 'static', 'dist');

const envConfig = {
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
    name: 'development',
    uglify: false,
    webpackMode: 'development',
    devtool: 'source-map',
    uglifySourceMap: false,
  },
};

module.exports = (env) => {
  // setup environmnet mode for dev, stage or prod
  let e = envConfig.dev;
  if (env !== undefined) {
    if (env.mode === 'prod') {
      e = envConfig.prod;
    }
    if (env.mode === 'stage') {
      e = envConfig.stage;
    }
    if (env.mode === 'dev') {
      e = envConfig.dev;
    }
  }

  console.log(`Building for ${e.name}`); // eslint-disable-line no-console

  let uglify = '';

  if (e.uglify) {
    uglify = new UglifyJsPlugin({
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
    });
  }
  const clean = new CleanWebpackPlugin([buildPath]);

  const define = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  });


  // Make the plugin array filtering out those plugins that are null
  const pluginArray = [
    uglify,
    define,
    clean].filter(elem => elem !== '');

  return {
    entry: {
      main: './app/app/static/src/main.js',
      entry2: './app/app/static/src/entry2.js',
      entry3: './app/app/static/src/entry3.js',
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
      // SplitChunks docs at https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
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
};
