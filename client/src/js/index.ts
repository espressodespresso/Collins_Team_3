import Reque***REMOVED***Service = require("./services/reque***REMOVED***Service");
import VerifyService = require("./services/authService");
import M = require("./mission.js");
import Sidebar = require("./sidebar.js");
import Map = require("./map.js");
import Leaflet = require('leaflet');
import {Stage, View} from "./view";

require("leaflet-draw");
require("../***REMOVED***yles.css");

let missions: M.Mission[] = [];
export let layers: M.MissionLayerGroup[] = [];
let level: Map.Levels;
let view = new View();

// Initialising Leaflet

let map = new Leaflet.Map('map', {
    zoomControl: false,
    center: [54.247468, -4.438477],
    zoom: 6
})

Leaflet

Leaflet.tileLayer('https://tile.open***REMOVED***reetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.open***REMOVED***reetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

map.addControl(new Leaflet.Control.Draw({
    position: "bottomright"
}));

let drawFeatures = new Leaflet.FeatureGroup();
map.addLayer(drawFeatures);

let heatMap;

async function ***REMOVED***art(): Promise<void> {
    await VerifyService.verifyCred("***REMOVED***", "***REMOVED***")
        .then(async r => {
            if(r) {
                console.log(await Reque***REMOVED***Service.getProductsHandler());
                await M.getMissions()
                    .then(async r => missions = r)
                    .catch(e => console.error("Unable to load missions\n" + e));
                await Map.initLayers(missions, map)
                    .then(async r => Map.addLayersToMap(r, false, map))
                    .catch(e => console.error("Unable to load layers\n" + e));
                await Sidebar.FormatSidebar(missions, map, view)
                    .then(loaded)
                    .catch(e => console.error("Unable to load sidebar\n" + e));
            } else {
                console.error("Login details incorrect");
            }
        }).catch(e => console.error(e));
}

async function loaded() {
    let spinner = document.getElementById("spinner-container");
    spinner.classLi***REMOVED***.add("invisible");
    level = Map.Levels.Marker;
    Map.initZoomEvent(map, level, missions);
    Map.initDrawEvent(map, drawFeatures, missions);
    // Using due to the lack of export support with Leaflet heatmap plugin
    /*heatMap = window['L'].heatLayer(await calculateHeatmapCoverage(missions)
        , { radius: (5 * map.getZoom()), maxZoom: 6 }).addTo(map);*/
    //await initSearchEvent();
    //view.setView(Stage.Table, missions);
}

***REMOVED***art();