const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    host: '192.168.1.68', // Accessible sur toutes les interfaces réseau
    port: 3000,
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
  }
});
