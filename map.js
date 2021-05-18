mapboxgl.accessToken = 'pk.eyJ1IjoidGFueWFuZyIsImEiOiJjanl0ZjJzaHUwM2dwM2xtaDJtNzlleWs4In0.3yIc4Cb3MrfjM8Kr1EoyhA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    // style: 'mapbox://styles/mapbox/streets-v11',
    // style: https://www.mapbox.com/maps/dark
    center: {lon: -87.71506, lat: 41.83819},
    zoom: 12.58,
    pitch: 0.00,
    bearing: 0.00
});

map.on('load', function() {
  map.addSource('fatal-police-shootings', {
    'type': 'geojson',
    // 'data': './data/fatal-police-shootings.geojson'
    'data': 'https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/fatal-police-shootings.geojson'  
  
  })

  map.addSource('total-departments', {
    'type': 'geojson',
    'data': 'https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/totalDepartments.geojson'  
  })

  map.addLayer({
    'id': 'fatal-deaths',
    'source': 'fatal-police-shootings',
    'type': 'circle',
    'paint': {
      'circle-radius': {
        'base': 5,
        'stops': [
          [12, 2],
          [22, 180]
        ]
      },
      'circle-color': '#e55e5e',
      
    }
  })

  map.addLayer({
    'id': 'participating',
    'source': 'total-departments',
    'type': 'fill',
    'paint': {
      'fill-color': [
        'interpolate',
        ['linear'],
        ["/", ['get', 'numberParticipating'], ['get', 'numberOfAgencies']],
        0,
        '#fff5f0',
        1,
        '#67000d'
      ],
    }
  })

  map.addLayer({
    'id': 'race',
    'source': 'fatal-police-shootings',
    'type': 'circle',
    'paint': {
      'circle-opacity': 0,
      'circle-opacity-transition': {duration: 2000},
    'circle-color': [
      'match',
      ['get', 'race'],
      'W',
      '#fbb03b',
      'B',
      '#223b53',
      'H',
      '#e55e5e',
      'A',
      '#3bb2d0',
      /* other */ '#ccc'
        ]
    }
  })

  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });
     
  map.on('mousemove', 'participating', function (e) {
    map.getCanvas().style.cursor = 'pointer';
    popup.setLngLat(e.lngLat).setHTML(e.features[0].properties.numberParticipating / e.features[0].properties.numberOfAgencies).addTo(map);
  });
     
  map.on('mouseleave', 'participating', function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
});

var chapters = {
    'adam-toledo': {
        center: {lon: -87.71506, lat: 41.83819},
        zoom: 12.58,
        pitch: 0.00,
        bearing: 0.00
    },
    'daunte-wright': {
        duration: 3000,
        center: {lon: -93.31144, lat: 45.06281},
        zoom: 13.00,
        pitch: 0.00,
        bearing: 0.00
    },
    'span-us': {
        duration: 3000,
        center: {lon: -100.63789, lat: 39.96627},
        zoom: 4.09,
        pitch: 0.00,
        bearing: 0.00
    },
    'marginalized-communities': {
      duration: 3000,
      center: {lon: -100.63789, lat: 39.96627},
      zoom: 4.09,
      pitch: 0.00,
      bearing: 0.00
   },
      'accountability': {
        duration: 3000,
        center: {lon: -100.63789, lat: 39.96627},
        zoom: 4.09,
        pitch: 0.00,
        bearing: 0.00
    },
    'data-incompleteness': {
        duration: 3000,
        center: {lon: -100.63789, lat: 39.96627},
        zoom: 4.09,
        pitch: 0.00,
        bearing: 0.00
    }, 
    'resources': {
      duration: 3000, 
      center: {lon: -100.63789, lat: 39.96627},
      zoom: 4.09,
      pitch: 0.00,
      bearing: 0.00
  }
};

// On every scroll event, check which element is on screen
window.onscroll = function () {
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            triggerMapChange(chapterName);
            break;
        }
    }
};

var activeChapterName = 'adam-toledo';
var activeMarker = new mapboxgl.Marker()
  .setLngLat(chapters[activeChapterName].center)
  .addTo(map);

var knownNames = ['adam-toledo', 'daunte-wright', 'makhia-bryant']

function triggerMapChange(chapterName) {
  if (chapterName === "data-incompleteness") {
    map.setLayoutProperty(
      'fatal-deaths',
      'visibility',
      'none'
    );
    map.setLayoutProperty(
      'participating',
      'visibility',
      'visible'
    );
  } else if (chapterName === "marginalized-communities") {
    setTimeout(function() {
      map.setPaintProperty(
        'race',
        'circle-opacity',
        1 
      )
    })
  } else {
    map.setLayoutProperty(
      'participating',
      'visibility',
      'none'
    );
    map.setLayoutProperty(
      'fatal-deaths',
      'visibility',
      'visible'
    );
    setTimeout(function() {
      map.setPaintProperty(
        'race',
        'circle-opacity',
        0
      )
    })
  }
}
function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;
    map.flyTo(chapters[chapterName]);

    // add markers for knownNames
    activeMarker.remove()
    if (knownNames.includes(chapterName)) {
      activeMarker = new mapboxgl.Marker()
      .setLngLat(chapters[chapterName].center)
      .addTo(map);
    }
    
    document.getElementById(chapterName).setAttribute('class', 'active');
    document.getElementById(activeChapterName).setAttribute('class', '');

    activeChapterName = chapterName;
}

function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 0;
}
