import {Map, TileLayer, FeatureGroup, Control} from "leaflet";
import "leaflet-draw";
import {verifyCred} from "./services/auth";
import {getMissions, Mission, MissionLayerGroup} from "./mission";
import {FormatSidebar, initSearchEvent} from "./sidebar";
import {addLayersToMap, initDrawEvent, initLayers, initZoomEvent, Levels} from "./map";
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

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

map.addControl(new Control.Draw({
    position: "bottomright"
}));

let drawFeatures = new FeatureGroup();
map.addLayer(drawFeatures);

/*(L.Control as any).geocoder({
    defaultMarkCode: true
}).addTo(map);*/

async function start(): Promise<void> {
    await verifyCred("hallam2", "2513@5De")
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

async function loaded() {
    let spinner = document.getElementById("spinner-container");
    spinner.classList.add("invisible");
    level = Levels.Marker;
    /*let test:IGeocoder;
    let test2:GeocodingCallback;
    test.geocode("Sheffield", test2);*/
    initZoomEvent(map, level, missions);
    initDrawEvent(map, drawFeatures, missions);
    //await initSearchEvent();
}

start();