
function drawCalendar(myData) {

  var calendarRows = function(month) {
    var m = d3.timeMonth.floor(month);
    return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
  }

  var minDate = new Date(2021, 0, 1);
  var maxDate = new Date(2021, 3, 21);

  var cellMargin = 2,
      cellSize = 30;

  var day = d3.timeFormat("%w"),
      week = d3.timeFormat("%U"),
      format = d3.timeFormat("%Y-%m-%d"),
      titleFormat = d3.utcFormat("%a, %d-%b"),
      monthName = d3.timeFormat("%B"),
      months= d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

  var color = d3.scaleOrdinal()
    .domain([0, 10])
    .range(["#a6cee3","#fb9a99","#b2df8a", "#fdbf6f","#cab2d6","#ffff99"])
  
  function coloring(d) {
    let count = myData.find(x => x.date === d).count
    // console.log(count)
    return color(count)
  }
  var svg = d3.select("#d3-calendar").selectAll("svg")
    .data(months)
    .enter().append("svg")
      .attr("class", "month")
      .attr("width", (cellSize * 7) + (cellMargin * 8) )
      .attr("height", function(d) {
        var rows = calendarRows(d);
        return (cellSize * rows) + (cellMargin * (rows + 1)) + 20; // the 20 is for the month labels
      })
    .append("g")

  svg.append("text")
    .attr("class", "month-name")
    .attr("x", ((cellSize * 7) + (cellMargin * 8)) / 2 )
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text(function(d) { return monthName(d); })

  var rect = svg.selectAll("rect.day")
    .data(function(d, i) {
      console.log('d', d)
      console.log('weird stuff', d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)))
      return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1));
    })
    .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("rx", 3).attr("ry", 3) // rounded corners
      .attr("fill", d => coloring(d)) // default light grey fill'#eaeaea'
      .attr("x", function(d) {
        return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin;
      })
      .attr("y", function(d) {
        return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) +
               ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) +
               cellMargin + 20;
       })
      .attr("margin-top", "10px")
      .on("mouseover", function(d) {
        d3.select(this).classed('hover', true);
      })
      .on("mouseout", function(d) {
        d3.select(this).classed('hover', false);
      })
      .datum(format);

  // rect.append("title")
  //   .text(function(d) { 
  //     // console.log('title', d)
  //     return titleFormat(new Date(d)); });

  // var rect = svg.selectAll("rect.day")
  //   .data(function(d, i) {
  //     return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1));
  //   })
  //   .enter().append("rect")
  //     .attr("class", "day")
  //     .attr("width", cellSize)
  //     .attr("height", cellSize)
  //     .attr("rx", 3).attr("ry", 3) // rounded corners
  //     .attr("fill", d => '#eaeaea') // default light grey fill
  //     .attr("x", function(d) {
  //       return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin;
  //     })
  //     .attr("y", function(d) {
  //       return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) +
  //              ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) +
  //              cellMargin + 20;
  //      })
  //     .attr("margin-top", "10px")
  //     .on("mouseover", function(d) {
  //       d3.select(this).classed('hover', true);
  //     })
  //     .on("mouseout", function(d) {
  //       d3.select(this).classed('hover', false);
  //     })
  //     .datum(format);

  // rect.append("title")
  //   .text(function(d) { 
  //     console.log(d)
  //     return titleFormat(new Date(d)); });

  // var lookup = d3.nest()
  //   .key(function(d) { return d.today; })
  //   .rollup(function(leaves) { return leaves.length; })
  //   .object(myData);

  var lookup = d3.rollup(myData, v => v.length, d => d.date)
  // console.log(lookup)

  // count = d3.nest()
  //   .key(function(d) { return d.today; })
  //   .rollup(function(leaves) { return leaves.length; })
  //   .entries(myData);

  var count = d3.rollup(myData, v => v.length, d => d.count)
  // console.log('count')
  // console.log(count)

  scale = d3.scaleLinear()
    .domain(d3.extent(count, function(d) { return d.count; }))
    .range([0.4,1]); // the interpolate used for color expects a number in the range [0,1] but i don't want the lightest part of the color scheme

  rect.filter(function(d) { return d in lookup; })
    .style("fill", function(d) { return d3.interpolatePuBu(scale(lookup[d])); })
    // .classed("clickable", true)
    // .on("click", function(d){
    //   if(d3.select(this).classed('focus')){
    //     d3.select(this).classed('focus', false);
    //   } else {
    //     d3.select(this).classed('focus', true)
    //   }
    //   // doSomething();
    // })
    // .select("title")
    //   .text(function(d) { return titleFormat(new Date(d)) + ":  " + lookup[d]; });

}

d3.csv("https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/MPVDatasetDownload-csv.csv").then((data) => {
  thisYearData = data.filter(d => d["Date of Incident (month/day/year)"].slice(-2) === "21");
  counted2021Date = {}
  thisYearData.forEach(d => {
    let date = new Date(d["Date of Incident (month/day/year)"]);
    counted2021Date[date] = (counted2021Date[date] || 0) + 1;
  })

  // convert object to array of objects
  let allDates = []
  Object.keys(counted2021Date).forEach(d => {
    allDates.push({date: d, count: counted2021Date[d]})
  })

  let missingDates = [new Date(2021, 0, 16), new Date(2021, 0, 23), new Date(2021, 2, 2)]
  missingDates.forEach(d => {
    allDates.push({date: d, count: 0})})

  let allDatesSorted = allDates.slice().sort((a, b) => b.date-a.date)
  console.log(allDatesSorted)
  drawCalendar(allDatesSorted)

});
