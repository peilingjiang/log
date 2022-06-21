// https://www.toptal.com/react/webpack-react-tutorial-pt-1

import sass from 'sass'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

export const config = {
  module: {
    rules: [
      {
        test: /\.js/,
        use: 'babel-loader',
        // include: __dirname + 'src/*',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js'],
  },
}

export const output = {
  filename: 'log.min.js',
  library: 'log',
  libraryTarget: 'umd',
  libraryExport: 'default',
  sourceMapFilename: 'log.min.js.map',
}
