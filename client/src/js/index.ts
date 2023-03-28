import {Map, TileLayer, FeatureGroup, Draw, Control, Polygon, GeoJSON} from "leaflet";
import "leaflet-draw";
import {verifyCred} from "./services/auth";
import {getMissions, Mission, MissionLayerGroup} from "./mission";
import {FormatSidebar} from "./sidebar";
import {addLayersToMap, calculateDrawnCoverage, clearMapLayers, generateLayers, initLayers, Levels} from "./map";
import {polygon} from "@turf/helpers";

let missions: Mission[] = [];
export let layers: MissionLayerGroup[] = [];
let level: Levels;

// Initialising Leaflet

let map = new Map('map', {
    zoomControl: false,
    center: [54.247468, -4.438477],
    zoom: 6
})

new TileLayer('https://tile.open***REMOVED***reetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.open***REMOVED***reetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

map.addControl(new Control.Draw({
    position: "bottomright"
}));

let drawFeatures = new FeatureGroup();
map.addLayer(drawFeatures);

map.on(Draw.Event.CREATED, async function (e) {
    let layer = e.layer;
    let drawGeoJSON = layer.toGeoJSON();
    switch (drawGeoJSON.geometry.type) {
        case "Polygon":
            let calculatedFeature: GeoJSON.Feature = await calculateDrawnCoverage(polygon(drawGeoJSON.geometry.coordinates), missions);
            let calculatedLayer = new GeoJSON(calculatedFeature);
            calculatedLayer.setStyle({color: '#ffc107'})
            await clearMapLayers(map);
            drawFeatures.addLayer(calculatedLayer);
            layer.setStyle({color: '#5c5c5c'})
            drawFeatures.addLayer(layer);
            break;
    }
})


/*(L.Control as any).geocoder({
    defaultMarkCode: true
}).addTo(map);*/

async function ***REMOVED***art(): Promise<void> {
    await verifyCred("***REMOVED***", ***REMOVED***)
        .then(async r => {
            if(r) {
                await getMissions()
                    .then(async r => missions = r)
                    .catch(() => console.error("Unable to load missions"));
                await initLayers(missions)
                    .then(async r => addLayersToMap(r, false, map))
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
    spinner.classLi***REMOVED***.add("invisible");
    level = Levels.Marker;
}

map.on("zoomend", async function (e) {
    let zoomLevel = map.getZoom();
    if(zoomLevel > 6 && zoomLevel < 10 && level !== Levels.Footprint) {
        level = Levels.Footprint;
        let generatedLayers = await generateLayers(missions, level);
        addLayersToMap(generatedLayers, true, map);
    } else if(zoomLevel > 9 && level !== Levels.Frame) {
        level = Levels.Frame;
        let generatedLayers = await generateLayers(missions, level);
        addLayersToMap(generatedLayers, true, map);
    } else if(zoomLevel < 7 && level !== Levels.Marker) {
        level = Levels.Marker;
        let generatedLayers = await generateLayers(missions, level);
        addLayersToMap(generatedLayers, true, map);
    }
})

***REMOVED***art();