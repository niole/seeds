var $ = require('jquery');
var d3 = require('d3');
var Rx = require('rx');

module.exports = (function() {

  function Seeds(height, width) {
    var seeds = this;

    this.svg = d3.select('body').append('svg')
                .attr("width", width)
                .attr("height", height);
    this.rect =
    this.svg.append("rect")
        .classed({"yellowrect": true})
        .attr("width", width)
        .attr("height", height)
        .style("fill", "yellow")
        .style("pointer-events", "all")
        .on("mousedown", function() {
           seeds.setincseed.call(seeds, this);
        });

    this.mouseMoves = Rx.Observable.fromEvent($(".yellowrect"), 'mousemove');
    this.mouseUp = Rx.Observable.fromEvent($(".yellowrect"), 'mouseup');
    this.mouseDown = Rx.Observable.fromEvent($(".yellowrect"), 'mousedown');

    this.mouseDrag = this.mouseDown.selectMany(function(pt) {
      return seeds.mouseMoves.takeUntil(seeds.mouseUp);
    });

    this.mouseDrag.subscribe(function(x)  {
      console.log('mousemove');
      return x;
    });

    this.height = height;
    this.width = width;
    this.data = [];
    this.down = 0;
    this.inProg = false;
    this.moveEvents = 0;
  }

  Seeds.prototype = new Seeds();

  Seeds.prototype.setxscale = function(npts, width) {
      this.xscale =
        d3.scale.linear()
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
    var self = this;
    if (this.inProg) {
      this.down += 1;
      this.data[this.data.length-1].r = this.down;
      this.drawsvg();
      window.incFunc = setTimeout(self.incseed.bind(self), 50);
    }
  };

  Seeds.prototype.setincseed = function(rectCtx) {
    var x = this.xscale.invert(d3.mouse(rectCtx)[0]);
    var y = this.yscale.invert(d3.mouse(rectCtx)[1]);

    if (!this.inProg) {
      this.inProg = true;
      this.plantseed(rectCtx);
      this.drawsvg();
      this.incseed();
    }
  };

  Seeds.prototype.stopincseed = function() {
    clearTimeout(window.incFunc);
    this.inProg = false;
    this.resetseed();
  };

  Seeds.prototype.resetseed = function() {
      this.down = 0;
  };

  Seeds.prototype.plantseed = function(rectCtx) {
    var x = this.xscale.invert(d3.mouse(rectCtx)[0]);
    var y = this.yscale.invert(d3.mouse(rectCtx)[1]);
    this.data.push({i: this.data.length, "x":x,"y":y,"r": this.down});
    this.drawsvg();
    this.inProg = true;
  }

  Seeds.prototype.drawsvg = function() {

    var seeds = this;

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
      .attr("r", function(d) { return d.r; })
      .on("mouseup", function() {
        seeds.stopincseed();
      });

    this.seeds
      .exit()
      .remove();
  };

  return {
    Seeds: Seeds
  }
}());
