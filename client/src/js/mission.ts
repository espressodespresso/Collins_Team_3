import RequestService = require("./services/requestService");
import S = require("./scene.js");
import index = require("./index.js");
import Leaflet = require('leaflet');
import {Scene} from "./scene";

export class Mission {
    private readonly _name: string;
    private readonly _id: string;
    private _scenes: S.Scene[];

    constructor(name: string, id: string, scenes: S.Scene[]) {
        this._name = name;
        this._id = id;
        this._scenes = scenes;
    }

    get name(): string {
        return this._name;
    }

    get id(): string {
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
    private readonly _id: string;
    private readonly _layerGroup: Leaflet.LayerGroup;
    private readonly _sceneLayers: S.SceneLayer[];
    private _status: boolean;

    constructor(id: string, layerGroup: Leaflet.LayerGroup, sceneLayers: S.SceneLayer[]) {
        this._id = id;
        this._layerGroup = layerGroup;
        this._sceneLayers = sceneLayers;
        this._status = true;
    }

    get id(): string {
        return this._id;
    }

    get layerGroup(): Leaflet.LayerGroup {
        return this._layerGroup;
    }

    get sceneLayers(): S.SceneLayer[] {
        return this._sceneLayers;
    }

    get status(): boolean {
        return this._status;
    }

    set status(value: boolean) {
        this._status = value;
    }
}

export async function getMissions(): Promise<Mission[]> {
    let missions: Mission[] = [];
    let products: [] = (await RequestService.getProductsHandler()).data;
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
            , result["objectstartdate"], result["footprint"]["coordinates"], result["identifier"]
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

export async function getMissionLayerByID(id: string): Promise<MissionLayerGroup> {
    for(let i=0; i < index.layers.length; i++) {
        let layer = index.layers[i];
        if(layer.id === id) {
            return layer;
        }
    }

    return null;
}