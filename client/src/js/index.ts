import {Map, TileLayer, FeatureGroup, Control} from "leaflet";
import "leaflet-draw";
import {verifyCred} from "./services/auth";
import {getMissions, Mission, MissionLayerGroup} from "./mission";
import {FormatSidebar, initSearchEvent} from "./sidebar";
import {addLayersToMap, calculateHeatmapCoverage, initDrawEvent, initLayers, initZoomEvent, Levels} from "./map";

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

let heatMap;

async function ***REMOVED***art(): Promise<void> {
    await verifyCred("***REMOVED***", ***REMOVED***)
        .then(async r => {
            if(r) {
                await getMissions()
                    .then(async r => missions = r)
                    .catch(() => console.error("Unable to load missions"));
                await initLayers(missions, map)
                    .then(async r => addLayersToMap(r, false, map))
                    .catch(() => console.error("Unable to load layers"));
                await FormatSidebar(missions, map)
                    .then(loaded)
                    .catch(e => console.error("Unable to load sidebar" + e));
            } else {
                console.error("Login details incorrect");
            }
        }).catch(e => console.error(e));
}

async function loaded() {
    let spinner = document.getElementById("spinner-container");
    spinner.classLi***REMOVED***.add("invisible");
    level = Levels.Marker;
    initZoomEvent(map, level, missions);
    initDrawEvent(map, drawFeatures, missions);
    // Using due to the lack of export support with Leaflet heatmap plugin
    /*heatMap = window['L'].heatLayer(await calculateHeatmapCoverage(missions)
        , { radius: (5 * map.getZoom()), maxZoom: 6 }).addTo(map);*/
    //await initSearchEvent();
}

***REMOVED***art();