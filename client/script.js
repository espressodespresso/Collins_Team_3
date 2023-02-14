var map = L.map('map', {zoomControl: false}).setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

//var marker = L.marker([51.51, -0.047]).addTo(map);

var object = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-0.047, 51.51]
    },
    "properties": {
      "name": "help"
    }
  };

var workplease = new L.GeoJSON(object).addTo(map);

workplease.setStyle(function(Feature){
    return {color: red};
    }
);




var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);


/*
function selectShape(sShape){
    switch (sShape){
        case 1:
            // Circle
            console.log("Circle");
            break;
        case 2:
            // Rectangle
            console.log("Rectangle");
            break;
        case 3:
            // Polygone
            console.log("Polygone");
            break;
    }
}
*/