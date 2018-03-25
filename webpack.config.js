const path = require('path');

module.exports = {
  entry: {
    'pixi': './src/pixi.ts',
    'three-line': './src/three-line.js'
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: true
};
