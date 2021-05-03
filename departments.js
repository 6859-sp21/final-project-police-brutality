d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/national-use-of-force-participation-data.csv").then((deptData) => {
  all_search_data = deptData.filter(d => d.Participating != '');
  sorted = false;
  default_data = true;

  // Make a list of Movie Names for Search
  dept_names = []
  dept_names = all_search_data.map(d => d[" Enrolled Agencies"]+', '+d["State"]);

  $( "#dept_search_box" ).autocomplete({
    source: function(request, response) {
       var results = $.ui.autocomplete.filter(dept_names, request.term);

       response(results.slice(0, 100));
   },
    select: function(event, ui) {
        if(ui.item){
            // $('#movie_search_box').val(ui.item.value); //default functionality.
            // find_movie(ui.item.value);
            // $('#dept_search_box').val('');
            return true;
        }
    }
  });
  // submit movie button
  $("#movie_search_box").keyup(function (e) {
      if (e.keyCode == 13) {
          // Do something
          // console.log('pressed enter');
          // find_movie($('#movie_search_box').val());
      }
  });
});

//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geoAlbers()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US

// Define path generator
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
var myColor = d3.scaleLinear().domain([0,2])
  .range(["white", "blue"])

var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

// Load in my states data!
d3.csv("totalDepartments.csv", function(data) {
color.domain([0,2]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("data/us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 1; i < data.length; i++) {

	// Grab State Name
	var dataState = data[i].state;

	// Grab data value
	var dataValue = data[i]['numberParticipating']/data[i]['Number of Agencies'];

	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.ratio = dataValue;

		// Stop looking through the JSON
		break;
		}
	}
}

// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {

	// Get data value
	var value = d.properties.visited;

	if (value) {
	//If value exists…
	return color(value);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});

// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
var legend = d3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 140)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice().reverse())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
	});

});
