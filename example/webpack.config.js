// DEV

import { __dirname, config } from '../webpack.common.js'
import path from 'path'

export default env => {
  if (env.development) {
    console.log('[DEV] Producing development build...')
    return {
      ...config,
      entry: './example/index.js',
      mode: 'development',
      output: {
        path: path.resolve(__dirname, 'example/public/dist'),
        publicPath: '/dist/',
        filename: 'index.bundle.js',
      },
      devServer: {
        static: {
          directory: path.join(__dirname, 'example/public'),
          publicPath: '/',
        },
        client: {
          reconnect: 1,
          logging: 'none',
        },
        port: 9000,
        hot: true,
        // host: '0.0.0.0',
        open: true,
        historyApiFallback: true,
        server: 'https',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers':
            'X-Requested-With, content-type, Authorization',
        },
      },
      optimization: {
        minimize: false,
      },
    }
  } else {
    console.log('[PROD] Producing production build...')
    return {
      ...config,
      entry: './example/index.js',
      mode: 'production',
      output: {
        path: path.resolve(__dirname, 'example/public/dist'),
        publicPath: '/dist/',
        filename: 'index.bundle.js',
      },
      optimization: {
        minimize: true,
      },
    }
  }
}
