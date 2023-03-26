import {getMissionLayerByID, Mission} from "./mission";
import {layers} from "./index";
import {LayerGroup} from "leaflet";
import {getSceneLayerByID} from "./scene";

export async function FormatSidebar(missions: Mission[], map): Promise<void> {
    for(let i=0; i < missions.length; i++) {
        let mission = missions[i];
        console.log(mission)
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
                if(missionLayer.layerGroup.hasLayer(layer)) {
                    missionLayer.layerGroup.removeLayer(layer);
                    console.log("hey i ran :)")
                } else {
                    missionLayer.layerGroup.addLayer(layer);
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
            let sceneLayer = (await getMissionLayerByID(e.target.id)).layerGroup;
            if(map.hasLayer(sceneLayer)) {
                map.removeLayer(sceneLayer);
            } else {
                map.addLayer(sceneLayer);
            }
        })
        li.appendChild(a);
        ul.appendChild(li);
        div.appendChild(ul);

        document.getElementById("sidebar").append(div);
    }
}