
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#leg_container")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/billData2.csv").then((lawData) => {
  cleanLawData = lawData.filter(d => d.status !== "");
  let statesData = {};
  const mySet = new Set();
  cleanLawData.forEach((element) => {
        if (!(element.state in statesData)){
          statesData[element.state] = {"Enacted": 0, "Pending": 0, "Failed": 0, "To Governor": 0,
                                      "Adopted": 0, "Vetoed": 0, "To Mayor": 0, "To Congress": 0, "Total": 0};
        }
        let status = element.status.split("-")[0].trim();
        mySet.add(status);
        if (status in statesData[element.state]){
          statesData[element.state][status] += 1;
          statesData[element.state]["Total"] += 1;
        }
    });



  let statesArray = []
  for (const state in statesData){
    statesArray.push({"state": state,...statesData[state]});
  }
  statesArray.sort(function(a, b) { return b.Total - a.Total; });
  let subgroups = Object.keys(statesData["CA"]).filter((key)=> key!=="Total");
  let smallerStatesArray = statesArray.slice(0,30);
  let groups = smallerStatesArray.map((entry) => entry.state);


    // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 500])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#32964d","#a31526", "#683c00", "#dd6e81", "#ff743c", "#255026",  "#96a467"]);

    // tooltips


    var tooltip = d3.select("div#leg_container").append("div")
      .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "white")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("width", "200px")

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    .order(d3.stackOrderDescending)
    (smallerStatesArray)


  // ----------------
  // Highlight a specific subgroup when hovered
  // ----------------

  // What happens when user hover a bar
  var mouseover = function(d) {
    console.log("over")
    // what subgroup are we hovering?
    var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
    // Reduce opacity of all rect to 0.2
    d3.selectAll(".myRect").style("opacity", 0.2)
    // Highlight all rects of this subgroup with opacity 0.8. It is possible to select them since they have a specific class = their name.
    d3.selectAll("."+subgroupName.split(" ")[0])
      .style("opacity", 1)
    }

    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9)
      .style("visibility", "visible")

  // When user do not hover anymore
  var mouseleave = function(d) {
    console.log("leave")
    // Back to normal opacity: 0.8
    d3.selectAll(".myRect")
      .style("opacity",0.8)

      tooltip.transition()
        .duration(50)
        .style("opacity", 0)
        .style("visiblity", 'hidden')
      }

  var mousemove = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
    tooltip.html("<b>Status:</b> " + subgroupName )
      .style("top",(event.pageY-10)+"px").style("left",(event.pageX+10)+"px").style("opacity", 0.9)
  }
  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .attr("class", function(d){ return "myRect " + d.key }) // Add a class to each subgroup: their name
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.state); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
        // .attr("stroke", "grey")
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)
      .on("mousemove", mousemove)




});
