// creating map object
var myMap = L.map('map',{
    center:[37.0902, -95.7129],
    zoom: 5
})

// adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);


// create function to create color for circles based on magnitude
function getColor(magnitude){
    switch(true){
        case (magnitude <= 1):
            return '#fde725';
            break;
        case (magnitude <= 2):
            return '#7ad151';
            break;
        case (magnitude <= 3):
            return '#22a884';
            break;
        case (magnitude <= 4):
            return '#2a788e';
            break;
        case (magnitude <= 5):
            return '#414487';
            break;
        case (magnitude > 5):
            return '#440154';
            break;
        default:
            return '#c0c0c0';
            break;
    }
}

// function to change size of circle based on magnitude 
function getRadius(magnitude){
    switch(true){
        case (magnitude <= 1):
            return 6;
            break;
        case (magnitude <= 2):
            return 8;
            break;
        case (magnitude <= 3):
            return 10;
            break;
        case (magnitude <= 4):
            return 12;
            break;
        case (magnitude <= 5):
            return 14;
            break;
        case (magnitude > 5):
            return 16;
            break;
        default:
            return 1;
            break;
    }
}  

// create variable for geo json url
var GeoJSONUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(GeoJSONUrl).then(function(data){

    L.geoJson(data,{
        pointToLayer: function (circle, latlng) {
            // create circle markers
            return L.circleMarker(latlng, {
                // radius based on magnitude
                radius: getRadius(circle.properties.mag), 
                // color based on magnitude
                fillColor: getColor(circle.properties.mag), 
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        // create pop up to display location and magnitude of each circle
        onEachFeature: function(circle, layer){
            layer.bindPopup(`<h3>${circle.properties.place}</h3><hr><span>Magnitude: ${circle.properties.mag}</span>`)
        }
    }).addTo(myMap);
    
    // Create a legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

        // scale for legend
        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5]

        // title for legend
        // div.innerHTML += "<h4>Magnitude Level</h4><hr>"

        // loop through each magnitude in the scale
        // create color square for each magnitude
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
    
});