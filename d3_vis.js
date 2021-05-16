
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

  legend
    .selectAll(null)
    .data(raceData)
    .enter()
    .append('rect')
    .attr('y', d => labelHeight * d.index * 1.8)
    .attr('width', labelHeight)
    .attr('height', labelHeight)
    .attr('fill', d => colorSeq(d.index))
    .attr('stroke', 'grey')
    .style('stroke-width', '1px');

  legend
    .selectAll(null)
    .data(raceData)
    .enter()
    .append('text')
    .text(d => d.data.key)
    .attr('x', labelHeight * 1.2)
    .attr('y', d => labelHeight * d.index * 1.8 + labelHeight)
    .style('font-family', 'sans-serif')
    .style('font-size', `${labelHeight}px`);

  var color = d3.scaleOrdinal(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b"]);

  var pie = d3.pie()
    .value(d => d.count)
    .sort(null);

  var arc = d3.arc()
    .innerRadius(0)
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
