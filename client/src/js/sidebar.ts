import Search = require("filter-data");
import M = require("./mission.js");
import S = require("./scene.js");
import Leaflet = require('leaflet');
import V = require("./view.js");
import index = require("./index.js");

const {NominatimJS} = require("@owsas/nominatim-js");
import {Mission} from "./mission";
import {Stage} from "./view";

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

            let a = document.createElement("a");
            a.innerHTML = "<hr class=\"dropdown-divider\">"
            a.classList.add("list-group-item");
            a.href = "#";
            container.appendChild(a);
            a = document.createElement("a");
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
        let sidebar = document.getElementById("sidebar");
        sidebar.append(div);

        let view_button = document.getElementById("view-button");
        view_button.addEventListener("click", async function(e: Event & {
            target: HTMLButtonElement
        }){
            let container = initDropdownContainer(e.target);
            let items = ["Map", "Table", "Histogram", "Heatmap"];
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
                            await view.setView(V.Stage.Map, missions);
                            break;
                        case "Table" :
                            await view.setView(V.Stage.Table, missions);
                            break;
                        case "Histogram" :
                            await view.setView(V.Stage.Histogram, missions);
                            break;
                        case "Heatmap" :
                            await view.setView(V.Stage.Heatmap, missions);
                            break;
                    }
                    console.log(view);
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
    container.style.marginTop = buttonBounding.top + "px";
    let sidebarC = document.getElementById("sidebar-container");
    let sidebarCBounding = sidebarC.getBoundingClientRect();
    container.style.marginLeft = sidebarCBounding.width + "px";
    container.addEventListener("mouseleave", async function(e: Event & {
        target: HTMLDivElement
    }) {
        if(e.target instanceof HTMLDivElement) {
            e.target.innerHTML = "";
        }
    });
    let elementID: string;
    switch (index.view.stage) {
        case Stage.Map:
            elementID = "map";
            break;
        case Stage.Table:
            elementID = "table";
            break;
        case Stage.Histogram:
            elementID = "histogram";
            break;
        case Stage.Heatmap:
            elementID = "map";
            break;
    }
    document.getElementById(elementID).addEventListener("mouseenter", async function(e: Event & {
        target: HTMLDivElement
    }) {
        let dropdownContainer = document.getElementById("dropdown-container");
        if(dropdownContainer.innerHTML !== "") {
            dropdownContainer.innerHTML = "";
        }
    });
    return container;
}

export async function initSearchEvent(missions: Mission[], map: Leaflet.Map) {
    document.getElementById("search-button").addEventListener("click"
        , async function(e: Event & { target: HTMLButtonElement}) {
        let input: HTMLInputElement = document.getElementById("search-input") as HTMLInputElement;

        NominatimJS.search({
            q: input.value
        }).then(res => {
            console.log(res);
            //let value = r[0];
            //map.flyTo(Leaflet.latLng(value["lat"], value["lon"]), 10, { animate: true});
            let items: object[] = [];
            for(let i=0; i < res.length; i++) {
                let localRes = res[i];
                let item = {
                    name: localRes["display_name"],
                    lat: localRes["lat"],
                    lon: localRes["lon"]
                }
                items.push(item);
            }
            console.log(items)
            initSearchQueryContainer(items, missions, map);
        }).catch(e => {
            console.error(e);
        })
    })
}

function initSearchQueryContainer(items: object[], missions: Mission[], map: Leaflet.Map) {
    let element = document.getElementById("search-query-container");
    if(element !== null) {
        element.innerHTML = ""
    }

    let container = document.getElementById("search-query-container");
    let searchContainerBounding = document.getElementById("search-container").getBoundingClientRect();
    container.style.marginTop = (searchContainerBounding.top + searchContainerBounding.height) + "px";
    container.style.marginRight = searchContainerBounding.left + "px";
    container.style.maxHeight = "300px";
    container.style.maxWidth = searchContainerBounding.width + "px";
    container.style.overflowY = "scroll";

    let input: HTMLInputElement = document.getElementById("search-input") as HTMLInputElement;
    let data = [];
    for(let i=0; i < missions.length; i++) {
        let mission = missions[i];
        let scenes = mission.scenes;
        for(let j=0; j < scenes.length; j++) {
            let scene = scenes[j];
            let obj = {
                missionname: mission.name,
                scenename: scene.name,
                countrycode: scene.countrycode,
                center: scene.center
            }
            data.push(obj);
        }
    }
    let searchConditions = [
        {
            key: ["missionname", "scenename", "countrycode"],
            value: input.value,
            type: Search.SearchType.LK
        }
    ];
    let searchResults = Search.filterData(data, searchConditions, {offset: 10,limit: 10});
    for(let i=0; i < searchResults.length; i++) {
        let data = searchResults[i];
        let item = {
            name: data["missionname"] + " " + data["scenename"],
            lat: data["center"][1],
            lon: data["center"][0]
        }
        items.unshift(item);
    }

    for(let i=0; i < items.length; i++) {
        let item = items[i];
        let a = document.createElement("a");
        a.classList.add("list-group-item", "fs-6");
        a.href = "#";
        a.innerHTML = item["name"];
        a.addEventListener("click", async function (e: Event & {
            target: HTMLAnchorElement
        }){
            map.flyTo(Leaflet.latLng(item["lat"], item["lon"]), 10, { animate: true })
            container.innerHTML = "";
        });
        container.appendChild(a);
    }
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