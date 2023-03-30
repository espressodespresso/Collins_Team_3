import RequestService = require("./services/requestService");
import S = require("./scene.js");
import index = require("./index.js");
import Leaflet = require('leaflet');

export class Mission {
    private readonly _name: string;
    private readonly _id: string;
    private readonly _aircraftTakeOffTime: bigint;
    private _scenes: S.Scene[];

    constructor(name: string, id: string, aircraftTakeOffTime: bigint) {
        this._name = name;
        this._id = id;
        this._aircraftTakeOffTime = aircraftTakeOffTime;
    }

    get name(): string {
        return this._name;
    }

    get id(): string {
        return this._id;
    }

    get aircraftTakeTime(): bigint {
        return this._aircraftTakeOffTime;
    }

    get scenes(): S.Scene[] {
        return this._scenes;
    }

    set scenes(Scenes: S.Scene[]) {
        this._scenes = Scenes;
    }

    async getMissionScenes(): Promise<S.Scene[]> {
        let scenes: S.Scene[] = [];
        //console.log(await RequestService.getMissionFootprintByID(this.id));
        const req = (await RequestService.getMissionSceneHandler(this.id));
        for (let i = 0; i < req.length; i++) {
            const data = req[i];
            let cString = data.centre.split(",");
            let center = [];
            center.push(cString[1], cString[0]);
            let coord = data.footprint.coordinates;
            scenes.push(new S.Scene(center, data.countrycode, data.firstFrameTime, coord
                , data.id, data.name.split(" ")[1]));
        }
        return scenes;
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
    const req = (await RequestService.getMissionsHandler()).data.missions;
    for(let i=0; i < req.length; i++) {
        const data = req[i]
        const id = data.id;
        let mission = new Mission(data.name, id, data.aircraftTakeOffTime);
        mission.scenes = await mission.getMissionScenes();
        missions.push(mission);
    }

    return missions
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

export async function getMissionScenes(id: string): Promise<S.Scene[]> {
    let scenes: S.Scene[] = [];
    const req = (await RequestService.getMissionSceneHandler(id)).data;
    for(let i=0; i < req.length; i++) {
        const data = req[i];
        let cString = data.centre.split(",");
        let center = [];
        center.push(cString[0], cString[1]);
        let coord = data.footprint.coordinates;
        scenes.push(new S.Scene(center, data.countrycode, data.firstFrameTime, coord
            , data.id, data.name.split(" ")[1]));
    }
    return scenes;
}

