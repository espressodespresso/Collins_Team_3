import {getMissionLayerByID, Mission} from "./mission";
import {getSceneLayerByID} from "./scene";
import {NominatimJS} from "@owsas/nominatim-js";
import {GeoJSON, LayerGroup, Map} from "leaflet";
import {addLayersToMap} from "./map";

export async function FormatSidebar(missions: Mission[], map): Promise<void> {
    for(let i=0; i < missions.length; i++) {
        let mission = missions[i];
        let div = document.createElement("div");
        div.classLi***REMOVED***.add("btn-group", "dropend");

        let button = document.createElement("button");
        button.append(document.createTextNode(mission.name))
        button.classLi***REMOVED***.add("btn", "btn-secondary", "dropdown-toggle");
        switch (i) {
            case 0: button.classLi***REMOVED***.add("rounded-top-2", "rounded-bottom-0"); break;
            case missions.length-1: button.classLi***REMOVED***.add("rounded-top-0", "rounded-bottom-2"); break;
            default: button.classLi***REMOVED***.add("rounded-0"); break;
        }
        button.setAttribute("type", "button");
        button.setAttribute("data-bs-toggle", "dropdown")
        div.appendChild(button);

        let ul = document.createElement("ul");
        ul.classLi***REMOVED***.add("dropdown-menu");
        let scenes = mission.scenes;
        let li;
        for(let j=0; j < scenes.length; j++) {
            let scene = scenes[j];
            li = document.createElement("li");
            let a = document.createElement("a");
            a.id = scene.id;
            a.classLi***REMOVED***.add("dropdown-item");
            a.href = "#";
            a.innerHTML = "Toggle " + scene.name;
            a.addEventLi***REMOVED***ener("click", async function (e: Event & {
                target: HTMLAnchorElement
            }) {
                let sceneLayer = await getSceneLayerByID(e.target.id);
                let missionLayer = await getMissionLayerByID(sceneLayer.parentid);
                let layer = sceneLayer.layer;
                let layerGroup = missionLayer.layerGroup;
                if(sceneLayer.***REMOVED***atus === true) {
                    layerGroup.removeLayer(layer);
                    sceneLayer.***REMOVED***atus = false;
                } else {
                    layerGroup.addLayer(layer);
                    sceneLayer.***REMOVED***atus = true;
                }
            })
            li.appendChild(a);
            ul.appendChild(li);
        }
        li = document.createElement("li");
        li.innerHTML = "<li><hr class=\"dropdown-divider\"></li>"
        ul.appendChild(li);
        li = document.createElement("li");
        let a = document.createElement("a");
        a.id = mission.id;
        a.classLi***REMOVED***.add("dropdown-item");
        a.href = "#";
        a.innerHTML = "Toggle " + mission.name;
        a.addEventLi***REMOVED***ener("click", async function (e: Event & {
            target: HTMLAnchorElement
        }) {
            let missionLayer = await getMissionLayerByID(e.target.id);
            let layterGroup = missionLayer.layerGroup;
            if(missionLayer.***REMOVED***atus === true) {
                map.removeLayer(layterGroup);
                missionLayer.***REMOVED***atus = false;
            } else {
                map.addLayer(layterGroup);
                missionLayer.***REMOVED***atus = true;
            }
        })
        li.appendChild(a);
        ul.appendChild(li);
        div.appendChild(ul);

        document.getElementById("sidebar").append(div);
    }
}

export async function initSearchEvent(map: Map) {
    document.getElementById("search-button").addEventLi***REMOVED***ener("click"
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
        let item = JSON.parse(JSON.***REMOVED***ringify(r[i]));
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
        te***REMOVED***.push(data);
    }*/
    console.log(GeoJSON);
    return geoJSON;
}