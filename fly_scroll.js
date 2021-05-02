mapboxgl.accessToken = 'pk.eyJ1IjoidGFueWFuZyIsImEiOiJjanl0ZjJzaHUwM2dwM2xtaDJtNzlleWs4In0.3yIc4Cb3MrfjM8Kr1EoyhA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: {lon: -87.71506, lat: 41.83819},
    zoom: 12.58,
    pitch: 0.00,
    bearing: 0.00
});
// var geojson = require('./data/fatal-police-shootings.geojson');
// console.log(geojson)
// var myLayer = L.mapbox.featureLayer().setGeoJSON(geojson).addTo(map);

// map.addSource('some id', {
//   type: 'geojson',
//   data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson'
//   });


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
    'makhia-bryant': {
        duration: 3000,
        center: [-82.839667, 39.915722],
        zoom: 13
    },
    'span-us': {
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
    }
};

// On every scroll event, check which element is on screen
window.onscroll = function () {
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            break;
        }
    }
};

var activeChapterName = 'adam-toledo';
function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;

    map.flyTo(chapters[chapterName]);

    document.getElementById(chapterName).setAttribute('class', 'active');
    document.getElementById(activeChapterName).setAttribute('class', '');

    activeChapterName = chapterName;
}

function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 0;
}