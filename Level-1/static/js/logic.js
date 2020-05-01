// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Global Variables & Main Script:
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //

// Main Logic:

// Center of the Map coordinates
var mapCenter = getMapCenter();
// Zoom level
var mapZoom = getMapZoom();
// get Map (html element) Id
var mapId = getMapId();
// MapBox API Key
var apiKey = getMapBoxAPIKey();

// Define  Map 
// (Pass in Id, Center & Zoom)
var map = createMap(mapId, mapCenter, mapZoom);

// Add Base Layer to Map
addBaseLayer(map);

// Add data to map: 

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  // Calculate color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // Here we add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(map);

  // Here we create a legend control object.
  var legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Finally, we our legend to the map.
  legend.addTo(map);
});






// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Get Map Center Corrdinates
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getMapCenter() {
  
  var mapCenterCoords = [40.7, -94.5];
  return mapCenterCoords;
  
}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Get Map Default Zoom Level
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getMapZoom() {
  
  var mapZoomLevel = 3;
  return mapZoomLevel;

}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Get Map Element Id (In HTM:L for Leaflet) 
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getMapId() {
 
  var mapIdInHtml = C_MAP_ID;
  return mapIdInHtml;

}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Get Mapbox API Key
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getMapBoxAPIKey() {
  
  var mapboxAPIKey = "";
  mapboxAPIKey = C_MAPBOX_API_KEY;
  // SMTODO: Replace by calling API
  // mapboxAPIKey = d3.request(apiUrlMapboxKey).get({retrun});

  // Return the Key
  return mapboxAPIKey;

}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Create Map
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
/**********************************************/
function createMap(pMapId ,pCenter, pZoom) {
  // Create the Map object
  var map = L.map(pMapId, {
    center: pCenter,
    zoom: pZoom
  });
  // Return the Map object
  return map;
}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Add Base Map Layer
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addBaseLayer(map) {
  // Adding tile layer
  var base = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: apiKey
  });
  base.addTo(map);
}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
