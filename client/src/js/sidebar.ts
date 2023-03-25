import {Mission} from "./mission";
import {layers} from "./index";
import {LayerGroup} from "leaflet";

export async function FormatSidebar(missions: Mission[]): Promise<void> {
    for(let i=0; i < missions.length; i++) {
        let mission = missions[i];
        console.log(mission)
        let div = document.createElement("div");
        div.classLi***REMOVED***.add("btn-group", "dropend");
        div.setAttribute("id", mission.id)

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
            li.innerHTML = "<a class=\"dropdown-item\" href=\"#\">" + "Toggle " + scene.name + "</a>"
            ul.appendChild(li);
        }
        li = document.createElement("li");
        li.innerHTML = "<li><hr class=\"dropdown-divider\"></li>"
        ul.appendChild(li);
        li = document.createElement("li");
        li.innerHTML = "<a class=\"dropdown-item\" href=\"#\">" + "Toggle " + mission.name + "</a>"
        ul.appendChild(li);
        div.appendChild(ul);

        document.getElementById("sidebar").append(div);
    }
}

export async function FormatEventLi***REMOVED***eners(map): Promise<void> {
    let items = document.getElementsByClassName("dropdown-item");
    for(let i=0; i < items.length; i++) {
        let item = items[i];
        let missionid = item.parentElement.parentElement.parentElement.id;
        let elementName = item.innerHTML.split(" ")[1].split('');
        switch (elementName[0]) {
            case 'T':
                break;
            case 'M':
                let foundLayer: LayerGroup;
                for(let j=0; j < layers.length; j++) {
                    let searchLayer = layers[j];
                    if(searchLayer.id === missionid) {
                        foundLayer = searchLayer.layerGroup;
                        break;
                    }
                }

                break;
            default:
                console.error("Fatal Error");
                return;
        }
    }
}