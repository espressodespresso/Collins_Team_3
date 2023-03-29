import {getMissionLayerByID, Mission} from "./mission";
import {getSceneLayerByID} from "./scene";
import {NominatimJS} from "@owsas/nominatim-js";
import {GeoJSON, Map} from "leaflet";


export async function FormatSidebar(missions: Mission[], map): Promise<void> {
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
            let element = document.getElementById("dropdown-container");
            if(element !== null) {
                element.innerHTML = ""
            }
            let scenes = mission.scenes;
            let container = document.getElementById("dropdown-container");
            let buttonBounding = e.target.getBoundingClientRect();
            container.style.paddingTop = buttonBounding.top + "px";
            let sidebarC = document.getElementById("sidebar-container");
            let sidebarCBounding = sidebarC.getBoundingClientRect();
            container.style.paddingLeft = sidebarCBounding.width + "px";
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
                    let sceneLayer = await getSceneLayerByID(e.target.id);
                    let missionLayer = await getMissionLayerByID(sceneLayer.parentid);
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
                let missionLayer = await getMissionLayerByID(e.target.id);
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
    }
}

export async function initSearchEvent(map: Map) {
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
        geoJSON.push(new GeoJSON(data as any));
    }

    /*for(let i=0; i < r.length; i++) {
        let item:  = r[i]
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
        test.push(data);
    }*/
    console.log(GeoJSON);
    return geoJSON;
}