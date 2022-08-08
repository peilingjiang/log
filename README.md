# Log Right Here, Right Now

## Access VS Log Server

Add the following lines to the `devServer` configuration in your `webpack.config.js`.

```js
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
}
```
