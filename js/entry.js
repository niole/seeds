var $ = require('jquery');
var svg = require('./seeds');

(function() {
  var width = $(window).width();
  var height = $(window).height();

  drawsvg(height, width);

  function drawsvg(height, width) {
    var Seeds = new svg.Seeds(height, width);
    Seeds.setxscale(width, width);
    Seeds.setyscale(height, height);
  }
}());
