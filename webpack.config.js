var path = require('path')

var externals = require('./package.json').dependencies

var ElectronConnectWebpackPlugin = require('electron-connect-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  debug: false,

  devtool: 'source-map',

  target: 'electron-renderer',

  entry: './app/app.js',

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
  },

  module: {
    loaders: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: ['transform-runtime'],
          presets: ['latest']
        }
      },

      {
        test: /\.json$/i,
        loader: 'json'
      },

      {
        test: /\.html$/i,
        loader: 'html'
      },

      {
        test: /\.css$/i,
        loaders: ['style', 'css?sourceMap', 'cssnext']
      },
    ],
  },

  cssnext: {
    features: {
      import: {
        path: ['./style']
      },
    },
  },

  plugins: [
    new ElectronConnectWebpackPlugin(),

    new CopyWebpackPlugin([
      { from: 'node_modules/systemjs-plugin-babel', to: 'systemjs-plugin-babel' },
      { from: 'app/plugins', to: 'plugins' },
    ]),
  ],

  externals: Object.keys(externals || {}),

}
