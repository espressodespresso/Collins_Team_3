import {verifyCred} from "./services/auth";
import {getMissions, Mission, MissionLayerGroup} from "./mission";
import {FormatSidebar} from "./sidebar";
import {generateLayers, initLayers, Levels} from "./map";
import {LayerGroup} from "leaflet";

let missions: Mission[] = [];
export let layers: MissionLayerGroup[] = [];
let level: Levels;

// Initialising Leaflet

let map = L.map('map', {
    zoomControl: false,
    center: [54.247468, -4.438477],
    zoom: 6
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

async function start() {
    await verifyCred("hallam2", "2513@5De")
        .then(async r => {
            if(r) {
                await getMissions()
                    .then(async r => missions = r)
                    .catch(() => console.error("Unable to load missions"));
                await initLayers(missions)
                    .then(async r => addLayersToMap(r, false))
                    .catch(() => console.error("Unable to load layers"));
                await FormatSidebar(missions, map)
                    .then(loaded)
                    .catch(() => console.error("Unable to load sidebar"));
            } else {
                console.error("Login details incorrect");
            }
        }).catch(e => console.error(e));
}

function loaded() {
    let spinner = document.getElementById("spinner-container");
    spinner.classList.add("invisible");
    level = Levels.Marker;
}

function addLayersToMap(localLayers: LayerGroup[], clear: boolean) {
    if(clear) {
        for(let i=0; i < layers.length; i++) {
            map.removeLayer(layers[i].layerGroup);
        }
    }
    for(let i=0; i < localLayers.length; i++) {
        let layer = localLayers[i];
        layer.addTo(map);
    }
}

map.on("zoomend", async function (e) {
    let zoomLevel = map.getZoom();
    if(zoomLevel > 6 && zoomLevel < 10 && level !== Levels.Footprint) {
        level = Levels.Footprint;
        let generatedLayers = await generateLayers(missions, level);
        addLayersToMap(generatedLayers, true);
    } else if(zoomLevel > 9 && level !== Levels.Frame) {
        level = Levels.Frame;

        let generatedLayers = await generateLayers(missions, level);
        addLayersToMap(generatedLayers, true);
    } else if(zoomLevel < 7 && level !== Levels.Marker) {
        level = Levels.Marker;
        let generatedLayers = await generateLayers(missions, level);
        addLayersToMap(generatedLayers, true);
    }
})

start();