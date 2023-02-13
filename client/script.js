var map = L.map('map').setView([51.505, -0.09], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

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