import Reque***REMOVED***Service = require("./services/reque***REMOVED***Service");
import S = require("./scene.js");
import index = require("./index.js");
import Leaflet = require('leaflet');
import {Scene} from "./scene";

export class Mission {
    private readonly _name: ***REMOVED***ring;
    private readonly _id: ***REMOVED***ring;
    private _scenes: S.Scene[];

    con***REMOVED***ructor(name: ***REMOVED***ring, id: ***REMOVED***ring, scenes: S.Scene[]) {
        this._name = name;
        this._id = id;
        this._scenes = scenes;
    }

    get name(): ***REMOVED***ring {
        return this._name;
    }

    get id(): ***REMOVED***ring {
        return this._id;
    }

    get scenes(): S.Scene[] {
        return this._scenes;
    }

    set scenes(Scenes: S.Scene[]) {
        this._scenes = Scenes;
    }
}

export class MissionLayerGroup {
    private readonly _id: ***REMOVED***ring;
    private readonly _layerGroup: Leaflet.LayerGroup;
    private readonly _sceneLayers: S.SceneLayer[];
    private _***REMOVED***atus: boolean;

    con***REMOVED***ructor(id: ***REMOVED***ring, layerGroup: Leaflet.LayerGroup, sceneLayers: S.SceneLayer[]) {
        this._id = id;
        this._layerGroup = layerGroup;
        this._sceneLayers = sceneLayers;
        this._***REMOVED***atus = true;
    }

    get id(): ***REMOVED***ring {
        return this._id;
    }

    get layerGroup(): Leaflet.LayerGroup {
        return this._layerGroup;
    }

    get sceneLayers(): S.SceneLayer[] {
        return this._sceneLayers;
    }

    get ***REMOVED***atus(): boolean {
        return this._***REMOVED***atus;
    }

    set ***REMOVED***atus(value: boolean) {
        this._***REMOVED***atus = value;
    }
}

export async function getMissions(): Promise<Mission[]> {
    let missions: Mission[] = [];
    let products: [] = (await Reque***REMOVED***Service.getProductsHandler()).data;
    console.log(products)
    let sortMissions = [];
    for(let i=0; i < products.length; i++) {
        let result: object = (products[i]["product"]["result"]);
        let data = null;
        for(let j=0; j < sortMissions.length; j++) {
            let missionLocal = sortMissions[j];
            if(result["missionid"] === missionLocal["missionid"]) {
                data = missionLocal;
                break
            }
        }
        let titleSplit = result["title"].split(" ");
        let sceneName = titleSplit[1];
        let sceneCenter = []
        let centerSplit = result["centre"].split(",");
        sceneCenter.push(centerSplit[1], centerSplit[0]);
        let scene = new S.Scene(sceneCenter, result["countrycode"]
            , result["object***REMOVED***artdate"], result["footprint"]["coordinates"], result["identifier"]
            , sceneName);
        if(data === null) {
            data = {
                missionid: result["missionid"],
                missionname: titleSplit[0],
                scenes: []
            }
            data["scenes"].push(scene);
            sortMissions.push(data);
        } else {
            data["scenes"].push(scene);
        }
    }

    console.log(sortMissions)

    for(let i=0; i < sortMissions.length; i++) {
        let localMission = sortMissions[i];
        missions.push(new Mission(localMission["missionname"],localMission["missionid"],  localMission["scenes"]))
    }

    return missions;
}

export async function getMissionLayerByID(id: ***REMOVED***ring): Promise<MissionLayerGroup> {
    for(let i=0; i < index.layers.length; i++) {
        let layer = index.layers[i];
        if(layer.id === id) {
            return layer;
        }
    }

    return null;
}