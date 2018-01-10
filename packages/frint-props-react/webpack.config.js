var webpack = require('webpack');

var minify = process.env.DIST_MIN;
var plugins = !minify
  ? []
  : [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      },
    }),
  ];
var filename = !minify
  ? 'frint-props-react.js'
  : 'frint-props-react.min.js';

module.exports = {
  entry: __dirname + '/src',
  output: {
    path: __dirname + '/dist',
    filename: filename,
    libraryTarget: 'umd',
    library: 'FrintPropsReact',
  },
  externals: {
    'frint-props': 'FrintProps',
    'frint-react': 'FrintReact',
  },
  target: 'web',
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            'travix'
          ],
        },
      },
    ],
  },
};
