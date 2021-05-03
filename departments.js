d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/national-use-of-force-participation-data.csv").then((deptData) => {
  all_search_data = deptData.filter(d => d.Participating != '');
  sorted = false;
  default_data = true;

  // Make a list of Movie Names for Search
  dept_names = []
  dept_names = all_search_data.map(d => d[" Enrolled Agencies"]+', '+d["State"]);

  $( "#dept_search_box" ).autocomplete({
    source: function(request, response) {
       let results = $.ui.autocomplete.filter(dept_names, request.term);

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
let width = 600;
let height = 400;

// D3 Projection
let projection = d3.geoAlbers()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([800]);          // scale things down so see entire US

// Define path generator
let path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
let color = d3.scaleSequential().domain([0,1])
  .interpolator(d3.interpolateReds);


//Create SVG element and append map to the SVG
let svg = d3.select("div#d3-completeness")
			.append("svg")
			.attr("width", width)
			.attr("height", height);




// Load in my states data!
d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/totalDepartments.csv").then((data) => {
color.domain([0,1]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/us-states.json").then((json) => {


// Loop through each state data value in the .csv file
for (let i = 1; i < data.length; i++) {

	// Grab State Name
	let dataState = data[i].state.trim();

	// Grab data value
	let dataValue = parseInt(data[i]['numberParticipating'])/parseInt(data[i]['Number of agencies']);
  if (dataValue > 1){
    dataValue = 1;
  }

	// Find the corresponding state inside the GeoJSON
	for (let j = 0; j < json.features.length; j++)  {
		let jsonState = json.features[j].properties.name;

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
	let value = d.properties.ratio;

	if (value) {
	//If value exists…
	return color(value);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});
// tooltips
var tooltip = d3.select("div#d3-completeness").append("div")
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
    tooltip.html( d.properties.name + ": " + d.properties.ratio.toFixed(2))
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

});
