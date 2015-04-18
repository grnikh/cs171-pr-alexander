/**
 * MapVis object
 * @constructor
 */

MapVis = function(_parentElement, _countriesData, _eventHandler)
{
    this.parentElement = _parentElement;
    this.topo = _countriesData;
    this.eventHandler = _eventHandler;

    this.margin = {top: 20, right: 0, bottom: 30, left: 70},
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.graticule = d3.geo.graticule();
    this.tooltip = this.parentElement.append("div").attr("class", "tooltip hidden");

    this.offsetL = 430;
    this.offsetT = 80;

    this.initVis();
}


/**
 * Method thatm sets up the SVG and the variables
 */
MapVis.prototype.initVis = function()
{
    var thatm = this;

    this.projection = d3.geo.mercator()
        .translate([thatm.width / 2, thatm.height / 2])
        .center([0, 45])
        .scale(thatm.width / 2 / Math.PI);

    this.path = d3.geo.path().projection(thatm.projection);

    this.parentElement
        .attr("transform", "translate(" + -500 + "," + 0 + ")")

    this.svg = this.parentElement.append("svg")
        .attr("width", thatm.width)
        .attr("height", thatm.height)
        .attr("class", "mapSvg")
        // .on("click", click)
        .append("g");

    this.g = this.svg.append("g");

    this.wrangleData();
    this.updateVis();
}


MapVis.prototype.wrangleData = function()
{
}

/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
MapVis.prototype.updateVis = function()
{
    thatm = this;

    this.svg.append("path")
        .datum(thatm.graticule)
        .attr("class", "graticule")
        .attr("d", thatm.path);

    this.g.append("path")
        .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
        .attr("class", "equator")
        .attr("d", thatm.path);

    this.country = this.g.selectAll(".country").data(thatm.topo);

    this.country.enter().insert("path")
      .attr("class", "country")
      .attr("d", thatm.path)
      .attr("id", function(d,i) { return d.id; })
      .attr("title", function(d,i) { return d.properties.name; })
      .style("fill", function(d, i) { return d.properties.color; });

    this.country.on("mousemove", function(d,i) {
        var mouse = d3.mouse(thatm.svg.node()).map(function(d) { return parseInt(d); });

        thatm.tooltip.classed("hidden", false)
            .attr("style", "left:"+(mouse[0]+thatm.offsetL)+"px;top:"+(mouse[1]+thatm.offsetT)+"px")
            .html(d.properties.name);
    })
    .on("mouseout", function(d,i) {
        thatm.tooltip.classed("hidden", true);
    })
    .on("click", function(d,i) {
        console.log(d.properties.name)
    });

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
MapVis.prototype.onSelectionChange = function ()
{
}

/**
 * Helper function thatm gets the width of a D3 element
 */
var getInnerWidth = function(element)
{
    var style = window.getComputedStyle(element.node(), null);
    return parseInt(style.getPropertyValue('width'));
}
