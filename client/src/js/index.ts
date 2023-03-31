import RequestService = require("./services/requestService");
import VerifyService = require("./services/authService");
import M = require("./mission.js");
import Sidebar = require("./sidebar.js");
import Map = require("./map.js");
import Leaflet = require('leaflet');
import V  = require("./view.js")


require("leaflet-draw");
require("../styles.css");

let missions: M.Mission[] = [];
export let layers: M.MissionLayerGroup[] = [];
let level: Map.Levels;
export let view = new V.View();

// Initialising Leaflet

export let map = new Map.Map;

async function start(): Promise<void> {
    await VerifyService.verifyCred("username", "password")
        .then(async r => {
            if(r) {
                console.log(await RequestService.getProductsHandler());
                await M.getMissions()
                    .then(async r => missions = r)
                    .catch(e => console.error("Unable to load missions\n" + e));
                await map.initLayers(missions)
                    .catch(e => console.error("Unable to load layers\n" + e));
                await Sidebar.FormatSidebar(missions, map.map, view)
                    .then(() => document.getElementById("view-button").classList.remove("invisible"))
                    .catch(e => console.error("Unable to load sidebar\n" + e));
                await view.setView(V.Stage.Map, missions)
                    .catch(e => console.error("Unable to set view state\n" + e))
                    .then(loaded);
            } else {
                console.error("Login details incorrect");
            }
        }).catch(e => console.error(e));
}

async function loaded() {
    let spinner = document.getElementById("spinner-container");
    spinner.classList.add("invisible");
    level = Map.Levels.Marker;
    map.initZoomEvent(level, missions);
    map.initDrawEvent(missions);
    await Sidebar.initSearchEvent(missions, map.map);
}

start();