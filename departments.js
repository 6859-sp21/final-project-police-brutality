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
