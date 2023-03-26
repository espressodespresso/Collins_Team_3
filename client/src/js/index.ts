import {verifyCred} from "./services/auth";
import {getMissions, Mission, MissionLayerGroup} from "./mission";
import {getMissionSceneHandler} from "./services/reque***REMOVED***";
import {FormatSidebar} from "./sidebar";
import {SceneLayer} from "./scene";
import {initLayers} from "./map";

let missions: Mission[] = [];
export let layers: MissionLayerGroup[] = [];

// Initialising Leaflet

let map = L.map('map', {
    zoomControl: false,
    center: [54.247468, -4.438477],
    zoom: 6
});

L.tileLayer('https://tile.open***REMOVED***reetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.open***REMOVED***reetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialising Leaflet.Draw
let drawControl = new L.Control.Draw({
    position: "bottomright",
});
map.addControl(drawControl)

let drawFeatures = L.featureGroup();
map.addLayer(drawFeatures);

map.on(L.Draw.Event.CREATED, function (e) {
    let layer = e.layer;
    drawFeatures.addLayer(layer)
})

/*(L.Control as any).geocoder({
    defaultMarkCode: true
}).addTo(map);*/

async function ***REMOVED***art() {
    let ***REMOVED***atus = await verifyCred("***REMOVED***", "***REMOVED***")
}

function loaded() {
    let spinner = document.getElementById("spinner-container");
    spinner.classLi***REMOVED***.add("invisible");
}


***REMOVED***art()
    .then(async () => missions = await getMissions())
    .then(async () => {
        let localLayers = await initLayers(missions);
        console.log(localLayers + "h");
        for(let i=0; i < localLayers.length; i++) {
            let layer = localLayers[i];
            layer.addTo(map);
        }
    })
    .then(async () => await FormatSidebar(missions, map))
    .then(() => loaded())
    .then(() => console.log(layers))
    .then(() => map.eachLayer(function (e) {
        console.log(e);
    }))
    /*.then(async () => await FormatSidebar(missions))
    .then(() => loaded());*/