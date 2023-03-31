import Search = require("filter-data");
import M = require("./mission.js");
import S = require("./scene.js");
import Leaflet = require('leaflet');
import V = require("./view.js");
import index = require("./index.js");

con***REMOVED*** {NominatimJS} = require("@owsas/nominatim-js");
import {Mission} from "./mission";
import {Stage} from "./view";

export async function FormatSidebar(missions: M.Mission[], map: Leaflet.Map, view: V.View)
    : Promise<void> {
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
        //button.setAttribute("type", "button");
        button.type = "button";
        button.id = mission.id;
        button.addEventLi***REMOVED***ener("click", async function(e: Event & {
            target: HTMLButtonElement
        }) {
            let scenes = mission.scenes;
            let container = initDropdownContainer(e.target);
            for(let j=0; j < scenes.length; j++) {
                let scene = scenes[j];
                let a = document.createElement("a");
                a.id = scene.id;
                a.classLi***REMOVED***.add("li***REMOVED***-group-item");
                a.href = "#";
                a.innerHTML = "Toggle " + scene.name;
                a.addEventLi***REMOVED***ener("click", async function (e: Event & {
                    target: HTMLAnchorElement
                }) {
                    let sceneLayer = await S.getSceneLayerByID(e.target.id);
                    let missionLayer = await M.getMissionLayerByID(sceneLayer.parentid);
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
                container.appendChild(a);
            }

            let a = document.createElement("a");
            a.innerHTML = "<hr class=\"dropdown-divider\">"
            a.classLi***REMOVED***.add("li***REMOVED***-group-item");
            a.href = "#";
            container.appendChild(a);
            a = document.createElement("a");
            a.id = mission.id;
            a.classLi***REMOVED***.add("li***REMOVED***-group-item");
            a.href = "#";
            a.innerHTML = "Toggle " + mission.name;
            a.addEventLi***REMOVED***ener("click", async function (e: Event & {
                target: HTMLAnchorElement
            }) {
                let missionLayer = await M.getMissionLayerByID(e.target.id);
                let layerGroup = missionLayer.layerGroup;
                if(missionLayer.***REMOVED***atus === true) {
                    map.removeLayer(layerGroup);
                    missionLayer.***REMOVED***atus = false;
                } else {
                    map.addLayer(layerGroup);
                    missionLayer.***REMOVED***atus = true;
                }
            })
            container.appendChild(a);
        });
        div.appendChild(button);
        let sidebar = document.getElementById("sidebar");
        sidebar.append(div);

        let view_button = document.getElementById("view-button");
        view_button.addEventLi***REMOVED***ener("click", async function(e: Event & {
            target: HTMLButtonElement
        }){
            let container = initDropdownContainer(e.target);
            let items = ["Map", "Table", "Hi***REMOVED***ogram", "Heatmap"];
            for(let i=0; i < items.length; i++) {
                let item = items[i];
                let a = document.createElement("a");
                a.id = item.toString();
                a.classLi***REMOVED***.add("li***REMOVED***-group-item");
                a.href = "#";
                a.innerHTML = item.toString();
                a.addEventLi***REMOVED***ener("click", async function (e: Event & {
                    target: HTMLAnchorElement
                }) {
                    switch (e.target.id) {
                        case "Map" :
                            await view.setView(V.Stage.Map, missions);
                            break;
                        case "Table" :
                            await view.setView(V.Stage.Table, missions);
                            break;
                        case "Hi***REMOVED***ogram" :
                            await view.setView(V.Stage.Hi***REMOVED***ogram, missions);
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
    container.***REMOVED***yle.marginTop = buttonBounding.top + "px";
    let sidebarC = document.getElementById("sidebar-container");
    let sidebarCBounding = sidebarC.getBoundingClientRect();
    container.***REMOVED***yle.marginLeft = sidebarCBounding.width + "px";
    container.addEventLi***REMOVED***ener("mouseleave", async function(e: Event & {
        target: HTMLDivElement
    }) {
        if(e.target in***REMOVED***anceof HTMLDivElement) {
            e.target.innerHTML = "";
        }
    });
    let elementID: ***REMOVED***ring;
    switch (index.view.***REMOVED***age) {
        case Stage.Map:
            elementID = "map";
            break;
        case Stage.Table:
            elementID = "table";
            break;
        case Stage.Hi***REMOVED***ogram:
            elementID = "hi***REMOVED***ogram";
            break;
        case Stage.Heatmap:
            elementID = "map";
            break;
    }
    document.getElementById(elementID).addEventLi***REMOVED***ener("mouseenter", async function(e: Event & {
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
    document.getElementById("search-button").addEventLi***REMOVED***ener("click"
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
    container.***REMOVED***yle.marginTop = (searchContainerBounding.top + searchContainerBounding.height) + "px";
    container.***REMOVED***yle.marginRight = searchContainerBounding.left + "px";
    container.***REMOVED***yle.maxHeight = "300px";
    container.***REMOVED***yle.maxWidth = searchContainerBounding.width + "px";
    container.***REMOVED***yle.overflowY = "scroll";

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
        a.classLi***REMOVED***.add("li***REMOVED***-group-item", "fs-6");
        a.href = "#";
        a.innerHTML = item["name"];
        a.addEventLi***REMOVED***ener("click", async function (e: Event & {
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
        geoJSON.push(Leaflet.geoJSON(data));
    }
    return geoJSON;
}