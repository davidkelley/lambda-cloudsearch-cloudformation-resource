module.exports = {
  entry: [
    'babel-polyfill',
    './handler.js'
  ],
  target: 'node',
  externals: {
    'aws-sdk': 'aws-sdk'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};
