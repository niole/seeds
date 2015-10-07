var $ = require('jquery');
var svg = require('./seeds');

(function() {

  drawsvg(700, 700);

  function drawsvg(height, width) {
    var Seeds = new svg.Seeds(height, width);
    Seeds.setxscale(width, width);
    Seeds.setyscale(height, height);
  }
}());
