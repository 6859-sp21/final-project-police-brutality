
// set the dimensions and margins of the graph
var margin = {top: 60, right: 230, bottom: 50, left: 100},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#d3-calendar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/all1033Categories.csv").then((data) => {


});
