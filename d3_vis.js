
Promise.all([
  d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/fatal-police-shootings-data.csv"),
  d3.json("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/race-population.json"),
]).then(function(data) {
  // files[0] will contain file1.csv
  // files[1] will contain file2.csv
  fpsData = data[0];
  raceData = data[1];
  d3_racism();
}).catch(function(err) {
  // handle error here
})

function d3_racism() {
  var width = 400, 
    height = 400, 
    innerRadius = 50,
    radius = Math.min(width, height) / 2,
    labelHeight = 10;

  var svg = d3.select("#d3-racism")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  var legend = svg 
    .append('g')
    .attr('transform', `translate(${radius * 2 + 20}, 0)`)

  // var color = d3.scaleOrdinal(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b"]);
  var color = d3.scaleOrdinal(["#a6cee3","#fb9a99","#b2df8a", "#fdbf6f","#cab2d6","#ffff99"])

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
      .on("change", update);

    function update() {
        var val = "killings"
        count += 1;
        // will start @ killings
        if (count % 2 === 0){
          val = "population"
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
