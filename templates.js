module.exports = {
  // the babelrc file which needs to be written in main
  babelrc: {
    name: '.babelrc',
    content: {
      presets: ['env'],
      plugins: ['transform-object-rest-spread', 'transform-react-jsx'],
    },
  },

  // gitignore written in main
  gitignore: {
    name: '.gitignore',
    content: 'node_modules/',
  },

  // webpackConfig written in main
  webpackConfig: {
    name: 'webpack.config.js',
    content: `var path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2' // THIS IS THE MOST IMPORTANT LINE! :mindblow: I wasted more than 2 days until realize this was the line most important in all this guide.
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}  
          }
        ]
      },
    ]
  },
  externals: {
    'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
  }
};`,
  },

  index: {
    name: 'src/index.js',
    content: `import React from 'react';

class MyComponent extends React.Component {
  render() {
    return (
      <div>This is my component</div>
    );
  }
}
export default MyComponent;`,
  },

  packageJSON: {
    name: 'package.json',
    content: {
      name: '',
      version: '0.1.0',
      description: '',
      main: 'build/index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
        start: 'webpack --watch',
        build: 'webpack',
      },
      author: {
        name: '',
        email: '',
      },
    },
  },
};
