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


// Map Layers:
// Create map layers
mapLayersList = createMapLayers();
// Base map layers dictionary for adding Leaflet control layer 
var mapLayers = {
  Outdoors: mapLayersList[0],
  Light: mapLayersList[1],
  Dark: mapLayersList[2],
  Streets: mapLayersList[3],
  Satellite: mapLayersList[4]
};


// Overlay Layers:
var tectonicLayer = new L.LayerGroup();
var earthquakeLayer = new L.LayerGroup();
// Overlay map layers dictionary for adding Leaflet control layer 
var overlayLayers = {
  "Tectonic Plates": tectonicLayer,
  "Earthquakes": earthquakeLayer
};


// Define Map 
// (Pass in Id, Center, Zoom & Layers)
var map = createMap(mapId, mapCenter, mapZoom, mapLayersList);


// Set base layer (Satelite) 
// mapLayers[4].addTo(map);


// Add control layers (Map layers & Overlay layers)  
L.control
 .layers(mapLayers, overlayLayers)
 .addTo(map);


// Fetch earthquake data 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
 
  // Add earthquakes to map 
  addEarthquakeData(map, data);

});


// Fetch Tectonic plates data
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function(data) {
    
  // Add tetonics to map 
  addTectonicData(map, data);

});


// Add color legend to map 
colorLegend = addEarthquakeColorLegend(map);
// colorLegend.addTo(map);
// Update legend (add details)
updateEarthquakeColorLegend();


// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Get Map Center Corrdinates
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getMapCenter() {
  
  var mapCenterCoords = [30, 0];

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
  
  // Later = Replace API key fetch from DB 
  // mapboxAPIKey = d3.request(apiUrlMapboxKey).get({retrun});

  return mapboxAPIKey;

}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Create Map
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
/**********************************************/
function createMap(pMapId ,pCenter, pZoom, pMapLayers) {

  // Create the Map object
  var map = L.map(pMapId, {
    center: pCenter,
    zoom: pZoom,
    layers: pMapLayers
  });

  // Return the Map object
  return map;

}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Create map layers
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function createMapLayers(map) {
  
  var mapLayer1 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: apiKey
  });
  
  var mapLayer2 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: apiKey
  });

  var mapLayer3 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: apiKey
  });

  var mapLayer4 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: apiKey
  });

  var mapLayer5 = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-satellite",
    accessToken: apiKey
  });

  return [mapLayer1, mapLayer2, mapLayer3, mapLayer4, mapLayer5];
  
}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Add Base Map Layer
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addBaseLayer(map, pBaseLayer) {

  // var streetsB = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  //   maxZoom: 18,
  //   id: "mapbox.streets",
  //   accessToken: apiKey
  // });

  pBaseLayer.addTo(map);

}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Add earthquake data
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addEarthquakeData(pMap, pEarthquakeData) {
  
  // Add a GeoJSON layer for earthquakes to the map once
  
  // List of earthquakes and style for adding to map
  var earthquakes  = L.geoJson(pEarthquakeData, {   
    // Add circle marker for each feature in the data
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // Set the style for each circle cmarker 
      style: addEarthquakeMapStyle,
      // Set popup for each marker - display magnitude & location of the earthquake
      onEachFeature: addEarthquakeMapFeature, 
      
  })

  // Add earthquakes to map:
  earthquakes.addTo(map);

  // Return
  return;

}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Add Tectonic data
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addTectonicData(pMap, pTectonicData) {
  
  // Add a GeoJSON layer for Tectonic to the map
  
  // List of earthquakes and style for adding to map
  var tectonics  = L.geoJson(pTectonicData, {   
      // Set the style for each circle cmarker 
      color: "#0000ff",
      weight: 2      
  })

  // Add earthquakes to map:
  tectonics.addTo(map);

  // Return
  return;

}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Earthquake circle marker style
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addEarthquakeMapStyle(feature) {

  // Note: feature is a list of dictionaries that has all earthquake coordinates  

  // Set the boundary & color per Country 
    return {
    
    // Opacity
    // Boundary opacity  
    opacity: 0.5, 
    // Circle marker opacity 
    fillOpacity: 0.5,

    // Color
    // Boundary color 
    color: "black",
    // Circle fill Color (based on magnitude of earthquake)
    // Color per country 
    fillColor: getEarthquakeCircleColor(feature.properties.mag),

    // Size (radius) (based on magnitude of earthquake)
    radius: getEarthquakeCircleRadius(feature.properties.mag),

    // Boundary 
    weight: 0.75,
    stroke: true

  };
  
}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Earthquake circle marker color
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getEarthquakeCircleColor(pMagnitude) {

  // Assign color  based on magnitude: 
  //  >=5 = #cc0000 
  //  >=4 = #ff8080
  //  >=3 = #ff9933
  //  >=2 = #ffe066
  //  >=1 = #ffff00
  //  <1  = #80ff00
  
  if (pMagnitude > 5) {
    return "#ff0000";  
  } 
  if (pMagnitude >= 4) {
    return "#ff8080";  
  } 
  if (pMagnitude >= 3) {
    return "#ff9933";  
  } 
  if (pMagnitude >= 2) {
    return "#ffe066";  
  } 
  if (pMagnitude >= 1) {
    return "#ffff00";  
  } 
  if (pMagnitude < 1) {
    return "#80ff00";  
  } 

}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Earthquake circle marker radius
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getEarthquakeCircleRadius(pMagnitude) {

  // Assign radius based on magnitude: 
  // If magnitude > 0 = return magnitude * 3 
  // Else  return 1

  if (pMagnitude >0) {
    return pMagnitude*3;  
  } 
  else {
    return 1;
  }

}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Earthquake map feature
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addEarthquakeMapFeature(feature , layer) {

  layer.on({

    // Mouse Over event - feature's opacity changes to 90% so that it stands out    
    mouseover: function(event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.90
      });
    },

    // Mouse Out event - feature's opacity reverts back to 50%
    mouseout: function(event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.5
      });
    },
  });
  
  // Tool tip popup on Mouse Click 
  layer.bindPopup("<h3> Magnitude: " + feature.properties.mag + "</h3> <hr> <h4> Location: " + feature.properties.place + "</h4>");
}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Add earthquake color legend 
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addEarthquakeColorLegend(map) {

  // Legend object (bottom right)
  var legend = L.control({
    position: "bottomright"
  });

  // Add div for legend
  legend.onAdd = function() {  
    var div = L.DomUtil.create("div", "colorlegend");
    return div;
  }
  
  // return legend
  map.addControl(legend);

}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Update earthquake color legend 
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function updateEarthquakeColorLegend(map) {

  // Add HTML code to legend 
  legend = d3.select(".colorlegend");
  // Clear any existing details 
  legend.html("");
  // color legend html
  var html = [
    '<div style = "background:#ccebff">',
    '<b> <u> Magnitude </u> </b> <span style="padding-left:20px"> </span> </br>',
    '<span style ="background:#ff0000"> .... </span> <span style="padding-left:5px"> </span> Above 5 </br>',
    '<span style ="background:#ff8080"> .... </span> <span style="padding-left:5px"> </span> 4 - 5 </br>',
    '<span style ="background:#ff9933"> .... </span> <span style="padding-left:5px"> </span> 3 - 4 </br>',
    '<span style ="background:#ffe066"> .... </span> <span style="padding-left:5px"> </span> 2 - 3 </br>',
    '<span style ="background:#ffff00"> .... </span> <span style="padding-left:5px"> </span> 1 - 2 </br>',
    '<span style ="background:#80ff00"> .... </span> <span style="padding-left:5px"> </span> Below 1',
    '</div>'
  ].join("");
  legend.html(html);

  // var html = [
  //   '<p style ="background-color:#ff0000"> <b> Magnitude 5 & above </b> </p>',
  //   '<p style ="background-color:#ff8080"> <b> Magnitude 4 - 5 </b> </p>',
  //   '<p style ="background-color:#ff9933"> <b> Magnitude 3 - 4 </b> </p>',
  //   '<p style ="background-color:#ffe066"> <b> Magnitude 2 - 3 </b> </p>',
  //   '<p style ="background-color:#ffff00"> <b> Magnitude 1 - 2 </b> </p>',
  //   '<p style ="background-color:#80ff00"> <b> Magnitude < 1 </b> </p>'
  // ].join("");

}

