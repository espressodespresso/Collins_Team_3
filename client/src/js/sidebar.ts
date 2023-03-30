import M = require("./mission.js")
import S = require("./scene.js")
import NominatimJS = require("@owsas/nominatim-js");
import Leaflet = require('leaflet');
import V = require("./view.js");

export async function FormatSidebar(missions: M.Mission[], map: Leaflet.Map, view: V.View)
    : Promise<void> {
    for(let i=0; i < missions.length; i++) {
        let mission = missions[i];
        let div = document.createElement("div");
        div.classList.add("btn-group", "dropend");

        let button = document.createElement("button");
        button.append(document.createTextNode(mission.name))
        button.classList.add("btn", "btn-secondary", "dropdown-toggle");
        switch (i) {
            case 0: button.classList.add("rounded-top-2", "rounded-bottom-0"); break;
            case missions.length-1: button.classList.add("rounded-top-0", "rounded-bottom-2"); break;
            default: button.classList.add("rounded-0"); break;
        }
        //button.setAttribute("type", "button");
        button.type = "button";
        button.id = mission.id;
        button.addEventListener("click", async function(e: Event & {
            target: HTMLButtonElement
        }) {
            let scenes = mission.scenes;
            let container = initDropdownContainer(e.target);
            for(let j=0; j < scenes.length; j++) {
                let scene = scenes[j];
                let a = document.createElement("a");
                a.id = scene.id;
                a.classList.add("list-group-item");
                a.href = "#";
                a.innerHTML = "Toggle " + scene.name;
                a.addEventListener("click", async function (e: Event & {
                    target: HTMLAnchorElement
                }) {
                    let sceneLayer = await S.getSceneLayerByID(e.target.id);
                    let missionLayer = await M.getMissionLayerByID(sceneLayer.parentid);
                    let layer = sceneLayer.layer;
                    let layerGroup = missionLayer.layerGroup;
                    if(sceneLayer.status === true) {
                        layerGroup.removeLayer(layer);
                        sceneLayer.status = false;
                    } else {
                        layerGroup.addLayer(layer);
                        sceneLayer.status = true;
                    }
                })
                container.appendChild(a);
            }
            let li = document.createElement("li");
            li.innerHTML = "<li><hr class=\"dropdown-divider\"></li>"
            container.appendChild(li);
            let a = document.createElement("a");
            a.id = mission.id;
            a.classList.add("list-group-item");
            a.href = "#";
            a.innerHTML = "Toggle " + mission.name;
            a.addEventListener("click", async function (e: Event & {
                target: HTMLAnchorElement
            }) {
                let missionLayer = await M.getMissionLayerByID(e.target.id);
                let layerGroup = missionLayer.layerGroup;
                if(missionLayer.status === true) {
                    map.removeLayer(layerGroup);
                    missionLayer.status = false;
                } else {
                    map.addLayer(layerGroup);
                    missionLayer.status = true;
                }
            })
            container.appendChild(a);
        });
        div.appendChild(button);
        document.getElementById("sidebar").append(div);

        let view_button = document.getElementById("view-button");
        view_button.addEventListener("click", async function(e: Event & {
            target: HTMLButtonElement
        }){
            let container = initDropdownContainer(e.target);
            let items = ["Map", "Table", "Histogram"];
            for(let i=0; i < items.length; i++) {
                let item = items[i];
                let a = document.createElement("a");
                a.id = item.toString();
                a.classList.add("list-group-item");
                a.href = "#";
                a.innerHTML = item.toString();
                a.addEventListener("click", async function (e: Event & {
                    target: HTMLAnchorElement
                }) {
                    switch (e.target.id) {
                        case "Map" :
                            view.setView(V.Stage.Map, missions);
                            break;
                        case "Table" :
                            view.setView(V.Stage.Table, missions);
                            break;
                        case "Histogram" :
                            view.setView(V.Stage.Histogram, missions);
                            break;
                    }
                });
                container.appendChild(a);
            }
        });
    }
}

function initDropdownContainer(target) {
    let element = document.getElementById("dropdown-container");
    if(element !== null) {
        element.innerHTML = ""
    }

    let container = document.getElementById("dropdown-container");
    let buttonBounding = target.getBoundingClientRect();
    container.style.paddingTop = buttonBounding.top + "px";
    let sidebarC = document.getElementById("sidebar-container");
    let sidebarCBounding = sidebarC.getBoundingClientRect();
    container.style.paddingLeft = sidebarCBounding.width + "px";
    return container;
}

export async function initSearchEvent(map: Leaflet.Map) {
    document.getElementById("search-button").addEventListener("click"
        , async function(e: Event & { target: HTMLButtonElement}) {
        let input: HTMLInputElement = document.getElementById("search-input") as HTMLInputElement;

        NominatimJS.search({
            q: input.value
        }).then(r => {
            //console.log(bbox(r[0].toGeoJSON()));
            //addLayersToMap(new LayerGroup(nominatimRToGeoJSON(r)), false, map);
        }).catch(e => {
            console.error(e);
        })
    })
}

function nominatimRToGeoJSON(r: []) {
    let geoJSON = [];
    for(let i=0; i < r.length; i++) {
        let item = JSON.parse(JSON.stringify(r[i]));
        console.log(item);
        let coord = [];
        coord.push(item.lat);
        coord.push(item.lon);
        let data: GeoJSON.Feature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: coord
            },
            properties: {
                display_name: item.display_name,
                license: item.license
            }
        }
        geoJSON.push(Leaflet.geoJSON(data));
    }
    return geoJSON;
}