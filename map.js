mapboxgl.accessToken = 'pk.eyJ1IjoidGFueWFuZyIsImEiOiJjanl0ZjJzaHUwM2dwM2xtaDJtNzlleWs4In0.3yIc4Cb3MrfjM8Kr1EoyhA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: {lon: -87.71506 - 0.04, lat: 41.83819},
    zoom: 12.58,
    pitch: 0.00,
    bearing: 0.00
});

// add Washington Post dataset
map.on('load', function() {
  map.addSource('fatal-police-shootings', {
    'type': 'geojson',
    'data': 'https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/fatal-police-shootings.geojson'
  })

  map.addSource('total-departments', {
    'type': 'geojson',
    'data': 'https://raw.githubusercontent.com/6859-sp21/final-project-police-brutality/main/data/totalDepartments.geojson'
  })

  map.addLayer({
    'id': 'participating',
    'source': 'total-departments',
    'type': 'fill',
    'paint': {
      'fill-opacity': 0,
      'fill-opacity-transition': {duration: 2000},
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
    'id': 'fatal-deaths',
    'source': 'fatal-police-shootings',
    'type': 'circle',
    'paint': {
      'circle-opacity-transition': {duration: 2000},
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
        '#a6cee3',
        'B',
        '#fb9a99',
        'H',
        '#b2df8a',
        'A',
        '#fdbf6f',
        'N',
        '#cab2d6',
        /* other */ '#ccc'
          ],
        // 'circle-radius': {
        //     'base': 10,
        //     'stops': [
        //       [12, 2],
        //       [22, 180]
        //     ]},
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
    'title': {
      center: {lon: -87.71506 - 0.04, lat: 41.83819},
      zoom: 12.58,
      pitch: 0.00,
      bearing: 0.00
    },
    'adam-toledo': {
      center: {lon: -87.71506 - 0.04, lat: 41.83819},
      zoom: 12.58,
      pitch: 0.00,
      bearing: 0.00
    },
    // 'daunte-wright': {
    //     duration: 3000,
    //     center: {lon: -93.31144, lat: 45.06281},
    //     zoom: 13.00,
    //     pitch: 0.00,
    //     bearing: 0.00
    // },
    'span-us': {
      duration: 3000,
      center: {lon: -108.63789, lat: 40.96627},
      zoom: 3.90,
      pitch: 0.00,
      bearing: 0.00
    },
    'why': {
      center: {lon: -108.63789, lat: 40.96627},
      zoom: 3.90,
      pitch: 0.00,
      bearing: 0.00
  },
    'marginalized-communities': {
      center: {lon: -108.63789, lat: 40.96627},
      zoom: 3.90,
      pitch: 0.00,
      bearing: 0.00
   },
    'sickle-cell': {
      duration: 3000,
      center: { lon: -80.07853 - 0.04, lat: 34.97325 },
      zoom: 12.58,
      pitch: 0.00,
      bearing: 0.00
    },
    'adam-toledo2': {
      duration: 3000,
      center: {lon: -87.71506 - 0.04, lat: 41.83819},
      zoom: 12.58,
      pitch: 0.00,
      bearing: 0.00
    },
    'militarization': {
      duration: 3000,
      center: {lon: -108.63789, lat: 40.96627},
      zoom: 3.90,
      pitch: 0.00,
      bearing: 0.00
    },
    'breonna-taylor': {
      duration: 3000,
      center: { lon: -85.70036 - 0.04, lat: 38.25642 },
      zoom: 12.58,
      pitch: 0.00,
      bearing: 0.00
    },
    'accountability': {
      duration: 3000,
      center: {lon: -108.63789, lat: 40.96627},
      zoom: 3.90,
      pitch: 0.00,
      bearing: 0.00
    },
    'data-incompleteness': {
      center: {lon: -108.63789, lat: 40.96627},
      zoom: 3.90,
      pitch: 0.00,
      bearing: 0.00
    },
    // 'world-issue': {
    //   center: {lon: -100.63789, lat: 39.96627},
    //     zoom: 4.09,
    //     pitch: 0.00,
    //     bearing: 0.00
    // },
    'resources': {
      center: {lon: -108.63789, lat: 40.96627},
      zoom: 3.90,
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

var activeChapterName = 'title';
var activeMarker = new mapboxgl.Marker()

var knownNames = ['adam-toledo', 'sickle-cell', 'adam-toledo2', 'breonna-taylor']

function triggerMapChange(chapterName) {
  if (chapterName === "data-incompleteness") {
    map.setLayoutProperty(
      'participating',
      'visibility',
      'visible'
    );
    setTimeout(function() {
      map.setPaintProperty(
        'fatal-deaths',
        'circle-opacity',
        0
      )
    })
    setTimeout(function() {
      map.setPaintProperty(
        'participating',
        'fill-opacity',
        1
      )
    })

  } else if (chapterName === "marginalized-communities") {
    setTimeout(function() {
      map.setPaintProperty(
        'race',
        'circle-opacity',
        0.8
      )
    })
  } else {

    setTimeout(function() {
      map.setPaintProperty(
        'participating',
        'fill-opacity',
        0
      )
      map.setLayoutProperty(
        'participating',
        'visibility',
        'none'
      );
    })
    setTimeout(function() {
      map.setPaintProperty(
        'fatal-deaths',
        'circle-opacity',
        1
      )
    })
    // map.setLayoutProperty(
    //   'participating',
    //   'visibility',
    //   'none'
    // );
    // map.setLayoutProperty(
    //   'fatal-deaths',
    //   'visibility',
    //   'visible'
    // );
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
      .setLngLat({lon: chapters[chapterName].center["lon"] + 0.04, lat: chapters[chapterName].center["lat"]})
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
