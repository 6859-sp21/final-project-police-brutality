d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/fatal-police-shootings-data.csv").then((data) => {
    fpsData = data;
    d3_test();
    d3_racism();
});

function d3_racism() {
  var width = 500, 
    height = 500, 
    innerRadius = 50
    radius = Math.min(width, height) / 2;

  var svg = d3.select("svg#d3-racism")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  var data = 
    [{race: "White", pop: 3972},
    {race: "Black", pop: 2288},
    {race: "Hispanic", pop: 1594},
    {race: "Asian", pop: 135},
    {race: "Native American", pop: 128},
    {race: "Pacfiic Island", pop: 51}]
              // {race: "Other", pop: 929}];

  var dataPopulation = 
    [{race: "White", pop: 197271953},
      {race: "Black", pop:  40045222},
      {race: "Hispanic", pop: 60724312},
      {race: "Asian", pop: 18381413},
      {race: "Native American", pop: 2297677},
      {race: "Pacfiic Island", pop: 65647905}]
              // {race: "Other", pop: 929}];
  
  var color = d3.scaleOrdinal()
    .domain(data)
    .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b"]);

  var pie = d3.pie()
    .value(function(d) {return d.pop})

  var data_ready = pie(data)

  // shape helper to build arcs:
  var arcGenerator = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(radius)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg.selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){return(color(d.data.race)) })
    .attr("stroke", "black")
    .style("opacity", 0.8)
    .each(function(d) {this._current = d})
    }
  
  d3.selectAll("input")
    .on("change", change)
    
  function change() {
    var value = this.value
    clearTimeout(timeout);
    pie.value(function(d) { return d[value]; }); // change the value function
    path = path.data(pie); // compute the new angles
    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

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