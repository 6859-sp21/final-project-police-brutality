
Promise.all([
  d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/fatal-police-shootings-data.csv"),
  d3.json("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/race-population.json"),
]).then(function(data) {
  // files[0] will contain file1.csv
  // files[1] will contain file2.csv
  fpsData = data[0];
  raceData = data[1];
  d3_racism();
  d3_militarization();
}).catch(function(err) {
  // handle error here
})

function d3_racism() {
  var width = 300,
    height = 300,
    innerRadius = 50,
    radius = Math.min(width, height) / 2,
    labelHeight = 10;
  var legendRectSize = 18;
  var legendSpacing = 4;

  var svg = d3.select("#d3-racism")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal(["#a31526","#32964d", "#683c00", "#ff743c", "#255026", "#dd6e81",  "#96a467"])

  var pie = d3.pie()
    .value(d => d.count)
    .sort(null);

  var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius)

  function type(d) {
    d.killings = Number(d.killings)
    d.population = Number(d.population)
    return d;
  }

  function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
  }

  d3.json("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/race-population.json", type).then(data => {
    var count = 0;
    d3.selectAll("input")
      .on("click", update);

    function update() {
        var val = "population"
        count += 1;
        // will start @ killings
        if (count % 2 === 0){
          val = "killings"
        }
        console.log(data[val])
        const path = svg.selectAll("path")
            .data(pie(data[val]));

        // Update existing arcs
        path.transition().duration(200).attrTween("d", arcTween);

        // Enter new arcs
        path.enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "2px")
            .each(function(d) { this._current = d; });
    }
    update();

    // tooltips
  var tooltip = d3.select("#d3-racism").append("div")
  .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "white")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("width", "200px")

  svg.selectAll("path")
    .on("mouseover", function(event, d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9)
        .style("visibility", "visible")})
    .on("mousemove", function(event, d) {
      d3.select(this)
        .style("opacity", 0.5)
      tooltip.html(d.data.race + ": " + d.data.percentage + "%")
        .style("top",(event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
    })
    .on("mouseout", function(){
      tooltip.transition()
        .duration(300)
        .style("opacity", 0)
        .style("visiblity", 'hidden')
      d3.select(this)
        .style("opacity", 1.0)})
  });

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

function d3_militarization() {

  // set the dimensions and margins of the graph
  var margin = {top: 60, right: 230, bottom: 50, left: 150},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#d3-militarization")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/all1033Categories.csv").then((data) => {

    //////////
    // GENERAL //
    //////////

    // List of groups = header of the csv files
    var keys = data.columns.slice(1)

    // color palette
    var color = d3.scaleOrdinal()
      .domain(keys)
      .range(["#32964d", "#a31526", "#96a467", "#683c00", "#ff743c", "#255026", "#dd6e81"]);

    //stack the data?
    var stackedData = d3.stack()
      .keys(keys)
      (data)



    //////////
    // AXIS //
    //////////

    // Add X axis
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0, width ]);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")))

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height+40 )
        .text("Year");

    // Add Y axis label:
    // svg.append("text")
    //     .attr("text-anchor", "end")
    //     .attr("x", -20)
    //     .attr("y", -20 )
    //     .text("Value of Loaned Equipment")
    //     .attr("text-anchor", "start")

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 2000000000])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.formatPrefix("$.1", 1e6)))
    //////////
    // BRUSHING AND CHART //
    //////////

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the scatter variable: where both the circles and the brush take place
    var areaChart = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Area generator
    var area = d3.area()
      .x(function(d) { return x(d.data.year); })
      .y0(function(d) { return y(d[0]); })
      .y1(function(d) { return y(d[1]); })

    // Show the areas
    areaChart
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
        .attr("class", function(d) { return "myArea " + d.key })
        .style("fill", function(d) { return color(d.key); })
        .attr("d", area)

    // Add the brushing
    areaChart
      .append("g")
        .attr("class", "brush")
        .call(brush);

    var idleTimeout
    function idled() { idleTimeout = null; }

    // A function that update the chart for given boundaries
    function updateChart(event) {

      extent = event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!extent){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain(d3.extent(data, function(d) { return d.year; }))
      }else{
        x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
        areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")))
      areaChart
        .selectAll("path")
        .transition().duration(1000)
        .attr("d", area)
      }



      //////////
      // HIGHLIGHT GROUP //
      //////////

      // What to do when one group is hovered
      var highlight = function(event, d){
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", .1)
        // expect the one that is hovered
        d3.select("."+d).style("opacity", 1)
      }

      // And when it is not hovered anymore
      var noHighlight = function(d){
        d3.selectAll(".myArea").style("opacity", 1)
      }



      //////////
      // LEGEND //
      //////////

      // Add one dot in the legend for each name.
      var size = 20
      svg.selectAll("myrect")
        .data(keys)
        .enter()
        .append("rect")
          .attr("x", 450)
          .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("width", size)
          .attr("height", size)
          .style("fill", function(d){ return color(d)})
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)

      // Add one dot in the legend for each name.
      svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
          .attr("x", 450 + size*1.2)
          .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function(d){ return color(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .on("mouseover", highlight)
          .on("mouseleave", noHighlight)

  });

}
