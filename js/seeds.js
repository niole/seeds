$(document).ready(function() {
  (function() {

    drawsvg(700, 700);

    function drawsvg(height, width) {
      var svg = new Seeds(height, width);
      svg.setxscale(50, width);
      svg.setyscale(50, height);
    }

    function Seeds(height, width) {
      this.svg = d3.select('body').append('svg')
                  .attr("width", width)
                  .attr("height", height);
      this.height = height;
      this.width = width;
      this.data = [];
      this.down = 0;
    }

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

    Seeds.prototype.makeseed = function() {
        this.down += 1;
    };

    Seeds.prototype.resetseed = function() {
        this.down = 0;
    };

    Seeds.prototype.plantseed = function() {
      var x = this.xscale.invert(d3.mouse(this)[0]);
      var y = this.yscale.invert(d3.mouse(this)[1]);
      this.data.push({"x":x,"y":y,"r": this.down});
      this.resetseed();
      this.drawsvg();
    }

    Seeds.prototype.drawsvg = function() {

      this.svg.append("rect")
          .attr("width",this.width)
          .attr("height", this.height)
          .style("fill", "none")
          .style("pointer-events", "all")
          .on("mouseup", function() { plantseed })
          .on("mousedown", function() { makeseed });

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

      this.bars
        .exit()
        .remove();
    };

  }())
});
