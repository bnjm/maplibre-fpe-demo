import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';

const publishableAccessToken = '1f4cc87d-575b-43fc-a6f3-2794e46f209a';
const floorId = '75978fb6-c302-4902-953f-b8245de1c103'
const endpoint = 'https://api.archilogic.com/v2'
const url = `${endpoint}/floor/${floorId}/geo-json?includeAllElements=true&pubtoken=${publishableAccessToken}`

const container = document.getElementById('map');
const map = new maplibregl.Map({
  container,
  center: [0, 0],
  zoom: 19,
  maxZoom: 25,
  maplibreLogo: false,
});

function drawMap(geoJson) {
  const floor = geoJson.features.find(
    (feature) => feature.properties.resourceType === 'Floor'
  );
  map.setCenter(floor.properties.origin);
  map.addSource('floorPlan', { type: 'geojson', data: geoJson });

  // Add fills and lines, using the included 'simplestyle' styles from the geojson features
  map.addLayer({
    id: 'fills',
    type: 'fill',
    source: 'floorPlan',
    filter: ["==", ["geometry-type"], "Polygon"],
    paint: {
      'fill-color': [
        // Apply a custom fill to spaces with certain property values
        'match',
        ['get', 'program'],
        'work',
        '#54c072',
        'meet',
        '#ffab00',
        // Default use the give fill color
        ['get', 'fill'],
      ],
    },
  });

  map.addLayer({
    id: 'lines',
    type: 'line',
    source: 'floorPlan',
    paint: { 'line-color': ['get', 'stroke'] },
  });
}

fetch(url)
  .then((res) => res.json())
  .then(drawMap)
  .catch(console.error);