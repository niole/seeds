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

  this.mouseDrag
      .subscribe(function(x) {
        console.log(x);
        seeds.incseed(true, x.pageX, x.pageY);
      });


    this.height = height;
    this.width = width;
    this.data = [];
    this.down = 0;
    this.inProg = false;
  }

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

  Seeds.prototype.incseed = function(move, x, y) {
    if (this.inProg) {
      this.down += 1;
      if (move) {
        this.plantseed(this.xscale.invert(x),this.yscale.invert(y));
      } else {
        this.data[this.data.length-1].r = this.down;
      }
      this.drawsvg();
      this.restarttimer();
    }
  };

  Seeds.prototype.setincseed = function(rectCtx) {
    var x = this.xscale.invert(d3.mouse(rectCtx)[0]);
    var y = this.yscale.invert(d3.mouse(rectCtx)[1]);

    if (!this.inProg) {
      this.inProg = true;
      this.plantseed( x, y);
      this.incseed(false, null, null);
    }
  };

  Seeds.prototype.stopincseed = function() {
    this.stoptimer();
    this.inProg = false;
    this.resetseed();
  };

  Seeds.prototype.stoptimer = function() {
    clearTimeout(window.incFunc);
  };

  Seeds.prototype.restarttimer = function() {
    var self = this;
    window.incFunc = setTimeout(self.incseed.bind(self, false, null, null), 50);
  };

  Seeds.prototype.resetseed = function() {
      this.down = 0;
  };

  Seeds.prototype.plantseed = function(x,y) {
    this.data.push({i: this.data.length, "x":x,"y":y,"r": this.down});
    this.drawsvg();
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
      .attr("cx", function(d) { return seeds.xscale(d.x); })
      .attr("cy", function(d) { return seeds.yscale(d.y); })
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
