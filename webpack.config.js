
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'quiz-widget.js',
    path: path.resolve(__dirname, 'dist'),
  },
 module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader'
          }
        ]
      }    
    ]
  }
};
