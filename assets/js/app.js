// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function(Data) {
    // Step 4: Parse the data
    // Format the data and convert to numerical and date values
    // =================================
    // Create a function to parse date and time
    // var parseTime = d3.timeParse("%d-%b");
  
    // Format the data
    Data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
    });
  
    // Step 5: Create the scales for the chart
    // =================================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(Data, d => d.poverty)])
      .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(Data, d => d.healthcare)])
      .range([height, 0]);
   // Step 6: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
       // Step 7: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 8: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "rgb(117, 145, 197)")
    .attr("opacity", ".5");
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.rockband}<br>Hair length: ${d.hair_length}<br>Hits: ${d.num_hits}`);
      });
      // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    // Add state labels to the points
    var circleLabels = chartGroup.selectAll(null).data(Data).enter().append("text");

    circleLabels
    .attr("x", function(d) {
        return xLinearScale(d.poverty);
    })
    .attr("y", function(d) {
        return yLinearScale(d.healthcare);
    })
    .text(function(d) {
        return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("lacks healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("in poverty (%)");
  }).catch(function(error) {
    console.log(error);
});
