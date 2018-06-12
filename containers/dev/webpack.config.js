const path = require('path');
const entryPoints = require('./lessons.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-unresolved
const CleanWebpackPlugin = require('clean-webpack-plugin'); // eslint-disable-line import/no-unresolved
const webpack = require('webpack'); // eslint-disable-line import/no-unresolved
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // eslint-disable-line import/no-unresolved
const Autoprefixer = require('autoprefixer'); // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies

const buildPath = path.resolve(__dirname, 'app', 'app', 'static', 'dist');

const envConfig = {
  prod: {
    name: 'production',
    uglify: true,
    webpackMode: 'production',
    devtool: false,
    uglifySourceMap: false,
    reactDevMode: false,
  },
  stage: {
    name: 'stage',
    uglify: true,
    webpackMode: 'production',
    devtool: 'source-map',
    uglifySourceMap: true,
    reactDevMode: false,
  },
  dev: {
    name: 'development',
    uglify: false,
    webpackMode: 'development',
    devtool: 'source-map',
    uglifySourceMap: false,
    reactDevMode: true,
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

  let define = '';
  if (envConfig.reactDevMode) {
    define = new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    });
  }

  const extract = new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].css',
    chunkFilename: '[id].css',
  });
  // const extract = new ExtractTextPlugin({
  //   filename: '[name].css',
  //   allChunks: true,
  // });

  // Make the plugin array filtering out those plugins that are null
  const pluginArray = [
    uglify,
    define,
    extract,
    clean].filter(elem => elem !== '');

  return {
    entry: entryPoints.entryPoints(),
    output: {
      path: buildPath,
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: 'babel-loader',
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: envConfig.uglifySourceMap,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [Autoprefixer],
                sourceMap: envConfig.uglifySourceMap,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: envConfig.uglifySourceMap,
              },
            },
          ],
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
            minChunks: 2000,
            priority: -20,
            reuseExistingChunk: true,
          },
          tools: {
            minSize: 10,
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
            test: /js\/(diagram|Lesson|tools|components)/,
            name: 'tools',
          },
          // commoncss: {
          //   minSize: 10,
          //   minChunks: 2,
          //   priority: -10,
          //   reuseExistingChunk: true,
          //   test: /css\/*\.(css|scss|sass)$/,
          //   name: 'commoncss',
          // // },
          // bootstrap: {
          //   test: /css\/bootstrap\*.css/,
          //   name: 'bootstrap',
          //   minChunks: 1,
          //   minSize: 10,
          //   priority: -20,
          // },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: 'vendors',
          },
        },
      },
    },
  };
};
