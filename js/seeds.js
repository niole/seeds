var d3 = require('d3');

module.exports = (function() {

  function Seeds(height, width) {
    this.svg = d3.select('body').append('svg')
                .attr("width", width)
                .attr("height", height);

    this.height = height;
    this.width = width;
    this.data = [];
    this.down = 0;
  }

  Seeds.prototype = new Seeds();

  Seeds.prototype.setxscale = function(npts, width) {
      this.xscale = d3.scale.linear()
          .domain([0, npts])
          .range([0, width]);
  };

  Seeds.prototype.setyscale = function(max, height) {
    this.yscale =
      d3.scale.linear()
            .domain([max, 0])
            .range([height, 0]);
  };

  Seeds.prototype.incseed = function() {
    this.down += 1;
  };

  Seeds.prototype.setincseed = function() {
    var self = this;
    window.incFunc = setInterval(function() {
      self.incseed();
    }, 500);
  };

  Seeds.prototype.stopincseed = function(rectCtx) {
    clearInterval(window.incFunc);
    this.plantseed(rectCtx);
  };

  Seeds.prototype.resetseed = function() {
      this.down = 0;
  };

  Seeds.prototype.plantseed = function(rectCtx) {
    var x = this.xscale.invert(d3.mouse(rectCtx)[0]);
    var y = this.yscale.invert(d3.mouse(rectCtx)[1]);
    this.data.push({"x":x,"y":y,"r": this.down});
    this.resetseed();
    this.drawsvg();
  }

  Seeds.prototype.drawsvg = function() {

    var seeds = this;

    this.svg.append("rect")
        .attr("width",this.width)
        .attr("height", this.height)
        .style("fill", "yellow")
        .style("pointer-events", "all")
        .on("mousedown", function() {
           seeds.setincseed()
        })
        .on("mouseup", function() {
          seeds.stopincseed.call(seeds, this)
        });

    this.seeds = this.svg.selectAll("circle")
                                .data(this.data);
    this.seeds
      .enter()
      .append("circle");

    this.seeds
      .select("circle");

    this.seeds
      .attr("cx", function(d) { return this.xscale(d.x);}.bind(this))
      .attr("cy", function(d) { return this.yscale(d.y); }.bind(this))
      .attr("r", function(d) { return d.r; });

    this.seeds
      .exit()
      .remove();
  };

  return {
    Seeds: Seeds
  }
}());
