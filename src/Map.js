import React, { useState, useEffect, useRef, createRef } from 'react';
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import './Map.css';

const MapBox = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoidGFueWFuZyIsImEiOiJjanl0ZjJzaHUwM2dwM2xtaDJtNzlleWs4In0.3yIc4Cb3MrfjM8Kr1EoyhA',
  scrollZoom: false, // disable scroll zoom
});

const chapters = {
  'adam-toledo': {
    center: [-87.71506, 41.83819],
    zoom: 12.58,
    pitch: 0.00,
    bearing: 0.00
  },
  'daunte-wright': {
    duration: 3000,
    center: [-93.31144, 45.06281 ],
    zoom: 13.00,
    pitch: 0.00,
    bearing: 0.00
  },
  'makhia-bryant': {
      duration: 3000,
      center: [-82.839667, 39.915722],
      zoom: 13,
  },
  'span-us': {
    duration: 3000,
    center: [-100.63789, 39.96627 ],
    zoom: 4.09,
    pitch: 0.00,
    bearing: 0.00},
};

const isClient = typeof window === 'object';


const mapStyle = "mapbox://styles/mapbox/light-v9";
function useWindowScroll() {
  console.log("inside fucntion useWindowScroll")
  console.log(isClient)
  const frame = useRef(0);
  const [state, setState] = useState({
    x: isClient ? window.pageXOffset : 0,
    y: isClient ? window.pageYOffset : 0,
  });

  useEffect(() => {
    function handler() {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setState({
          x: window.pageXOffset,
          y: window.pageYOffset,
        })
      });
    }

    window.addEventListener('scroll', handler, {
      capture: false,
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', handler);
    };
  }, []);

  return state;
}

const Section = React.forwardRef(({ title, center }, ref) => {
  return (
    <div className="section" ref={ref}>
      <h3>{title}</h3>
      <p>{center}</p>
    </div>
  );
});

function Map() {
  const scrollPosition = useWindowScroll();
  const [activeChapterName, setActiveChapterName] = useState(() => 'adam-toledo');
  const mapRef = useRef();

  // create refs for locations to get bounds
  const refs = useRef(Object.keys(chapters).reduce((acc, value) => {
    acc[value] = createRef();
    return acc;
  }, {}));

  useEffect(() => {
    function setActiveChapter(chapterName) {
      if (chapterName === activeChapterName) return;
      setTimeout(() => {
        mapRef.current.flyTo(chapters[chapterName]);
      }, 10)

      console.log('inside flying code')

      refs.current[chapterName].current.classList.add('active');
      refs.current[activeChapterName].current.classList.remove('active');
      
      setActiveChapterName(chapterName);
    }

    function isElementOnScreen(id) {
      var element = refs.current[id].current;
      var bounds = element.getBoundingClientRect();
      return bounds.top < window.innerHeight && bounds.bottom > 0;
    }

    const chapterNames = Object.keys(chapters);
    for (let i = 0, len = chapterNames.length; i < len; i++) {
      let chapterName = chapterNames[i];
      if (isElementOnScreen(chapterName)) {
        setActiveChapter(chapterName);
        break;
      }
    }
  }, [scrollPosition, activeChapterName]);

  function handleStyleLoad(map) {
    mapRef.current = map;
  }

  return (
    <div>
      <MapBox
        style={mapStyle}
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
        className="test-map"
        onStyleLoad={handleStyleLoad}
      >
        {Object.keys(chapters).map((chapter, index) => (
          <Marker
            key={index}
            coordinates={chapters[chapter].center}
            anchor="bottom"
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: '#33f',
                borderRadius: '50%',
              }}
            />
          </Marker>
        ))}
      </MapBox>
      <div className="features">
        {Object.keys(chapters).map((chapter, index) => (
          <Section
            key={index}
            title={chapter}
            center={chapters[chapter].center}
            ref={refs.current[chapter]}
          />
        ))}
      </div>
      <div>d3 goes here hopefully</div>
    </div>
  );
}

export default Map;

