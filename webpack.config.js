// PROD

import webpack from 'webpack'
// import MiniCssExtractPlugin from "mini-css-extract-plugin"

import fs from 'fs'
import { __dirname, config, output } from './webpack.common.js'

const packageJSON = JSON.parse(fs.readFileSync('./package.json'))

export default env => {
  if (env.production) {
    console.log('Producing production build...')
    return {
      ...config,
      entry: './src/index',
      mode: 'production',
      output: { ...output, path: __dirname + '/lib', clean: true },
      optimization: {
        minimize: true,
      },
      experiments: {
        outputModule: true,
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.BannerPlugin(`  Log Right Here, Right Now! HyperLog v${
          packageJSON.version
        }

  / a research project /

  by Peiling Jiang at Creativity Lab UCSD (c)
  https://creativity.ucsd.edu/
  ${new Date().getFullYear()}

  MIT License`),
      ],
    }
  }
}
