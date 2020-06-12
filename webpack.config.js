const path = require('path');
module.exports = {
  target: 'web',
  mode: 'development',
  entry: {
    app: './src/main.js',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
  },
};
