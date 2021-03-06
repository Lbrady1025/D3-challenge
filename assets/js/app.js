// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";

var chosenYAxis = "healthcare";

function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    
    return xLinearScale;
}

function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
            d3.max(data, d => d[chosenYAxis]) * 1.2
        ])
        .range([0,height]);
    
    return yLinearScale;
}

function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        label = "Age (Median)";
    }
    else {
      label = "Household Income (Median)";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

d3.csv("assets/data/data.csv").then(function(data,err){
    if (err) throw err;

    data.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    var xLinearScale = xScale(data, chosenXAxis);

    var yLinearScale = yScale(data, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".5")
        .append("text", d => d.abbr);

    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width + 20}, ${height / 2})`);
    
    var obesityLabel = ylabelsGroup.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .classed("active", true)
        .text("Obesity (%)");

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("x", 20)
        .attr("y", 0)
        .classed("inactive", true)
        .text("Smokes (%)");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    xlabelsGroup.selectAll("text")
        .on("click", function() {
            var xValue = d3.select(this).attr("value");
            if (xValue !== chosenXAxis) {

                chosenXAxis = xValue;

                xLinearScale = xScale(data, chosenXAxis);

                xAxis = renderAxes(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale,chosenXAxis);

                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === "poverty") {
                    povertyLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    ageLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    incomeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                else if (chosenXAxis === "age") {
                    ageLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    povertyLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    incomeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                  else {
                    ageLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    povertyLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    incomeLabel
                      .classed("active", true)
                      .classed("inactive", false);
                  }

            }
        });
    ylabelsGroup.selectAll("text")
        .on("click", function() {
            var yValue = d3.select(this).attr("value");
            if (yValue !== chosenYAxis) {

                chosenYAxis = yValue;

                yLinearScale = xScale(data, chosenYAxis);

                yAxis = renderAxes(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, yLinearScale,chosenYAxis);

                circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

                if (chosenYAxis === "obesity") {
                    obesityLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    smokesLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    healthcareLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                else if (chosenYAxis === "smokes") {
                    smokesLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    obesityLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    healthcareLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
                  else {
                    smokesLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    obesityLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    ihealthcareLabel
                      .classed("active", true)
                      .classed("inactive", false);
                  }

            }
        });
}).catch(function(error){
    console.log(error);
});