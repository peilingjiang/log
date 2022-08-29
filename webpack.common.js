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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
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
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.scss', '.svg'],
  },
}

export const output = {
  library: 'log',
  libraryTarget: 'umd',
  libraryExport: 'default',
  filename: 'log.min.js',
  sourceMapFilename: 'log.min.js.map',
}
