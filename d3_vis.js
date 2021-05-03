d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/fatal-police-shootings-data.csv").then((data) => {
    fpsData = data;
    d3_test();
    d3_racism();
});

function d3_racism() {
  var width = 500, 
    height = 500, 
    radius = Math.min(width, height) / 2;

  var svg = d3.select("svg#d3-racism")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  var data = [{race: "White", pop: 3972},
              {race: "Black", pop: 2288},
              {race: "Hispanic", pop: 1594}];
  
  var color = d3.scaleOrdinal()
    .domain(data)
    .range(d3.schemeSet2);

  var pie = d3.pie()
    .value(function(d) {return d.pop})
  var data_ready = pie(data)

  // shape helper to build arcs:
  var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', arcGenerator)
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)

  }

function d3_test() {
    testData = fpsData.slice(6200).filter(d => d.age !== "" && d.name !== "");

    var barHeight = 25,
        width = 1000,
        height = testData.length * barHeight;

    const container = d3.select("svg#d3_test")
        .attr("width", width)
        .attr("height", height);
    container.selectAll("rect")
        .data(testData)
        .join("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * barHeight)
            .attr("width", d => parseInt(d.age))
            .attr("height", barHeight)
    container.selectAll("text")
        .data(testData)
        .join("text")
            .attr("x", d => parseInt(d.age))
            .attr("y", (d, i) => i * barHeight)
            .attr("dx", "15")
            .attr("dy", "1.3em")
            .text(d => d.name + ", " + d.age)
};