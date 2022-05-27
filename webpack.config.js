// PROD

// import MiniCssExtractPlugin from "mini-css-extract-plugin"

import { __dirname, config, output } from './webpack.common.js'

export default env => {
  if (env.production) {
    console.log('Producing production build...')
    return {
      ...config,
      entry: './src',
      mode: 'production',
      output: Object.assign({}, output, {
        path: __dirname + '/lib',
      }),
      optimization: {
        minimize: true,
      },
    }
  }
}
