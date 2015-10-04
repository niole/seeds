var webpack = require("webpack");
var express = require('express');
var app = express();

//var home = app.use(express.static('static'));
var home = app.use(express.static('static'));

var compiler = webpack({
  entry: ['./js/entry.js'],
  output: {
    path: __dirname + '/static',
    filename: 'bundle.js'
  },
  devServer: {
    publicPath: "/static"
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader' }
    ]
  }
});

compiler.run(function(err, stats) {
  if (err) {
    console.error(err);
  } else {
    console.log(stats);
  }
});

app.get('/', function (req, res) {
  res.send(home);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});
