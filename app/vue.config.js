const path = require('path');

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://express:5000',
        changeOrigin: true,
      }
    }
  }
};