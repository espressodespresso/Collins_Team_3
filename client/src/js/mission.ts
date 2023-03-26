import {getMissionSceneHandler, getMissionsHandler} from "./services/reque***REMOVED***";
import {Scene, SceneLayer} from "./scene";
import {LayerGroup} from "leaflet";
import {layers} from "./index";

export class Mission {
    private readonly _name: ***REMOVED***ring;
    private readonly _id: ***REMOVED***ring;
    private readonly _aircraftTakeOffTime: bigint;
    private _scenes: Scene[];

    con***REMOVED***ructor(name: ***REMOVED***ring, id: ***REMOVED***ring, aircraftTakeOffTime: bigint) {
        this._name = name;
        this._id = id;
        this._aircraftTakeOffTime = aircraftTakeOffTime;
    }

    get name(): ***REMOVED***ring {
        return this._name;
    }

    get id(): ***REMOVED***ring {
        return this._id;
    }

    get aircraftTakeTime(): bigint {
        return this._aircraftTakeOffTime;
    }

    get scenes(): Scene[] {
        return this._scenes;
    }

    set scenes(Scenes: Scene[]) {
        this._scenes = Scenes;
    }

    async getMissionScenes(): Promise<Scene[]> {
        let scenes: Scene[] = [];
        con***REMOVED*** req = (await getMissionSceneHandler(this.id)).data;
        for (let i = 0; i < req.length; i++) {
            con***REMOVED*** data = req[i];
            let cString = data.centre.split(",");
            let center = [];
            center.push(cString[1], cString[0]);
            let coord = data.footprint.coordinates;
            scenes.push(new Scene(center, data.countrycode, data.fir***REMOVED***FrameTime, coord
                , data.id, data.name.split(" ")[1]));
        }
        return scenes;
    }
}

export class MissionLayerGroup {
    private readonly _id: ***REMOVED***ring;
    private readonly _layerGroup: LayerGroup;
    private readonly _sceneLayers: SceneLayer[];
    private _***REMOVED***atus: boolean;

    con***REMOVED***ructor(id: ***REMOVED***ring, layerGroup: LayerGroup, sceneLayers: SceneLayer[]) {
        this._id = id;
        this._layerGroup = layerGroup;
        this._sceneLayers = sceneLayers;
        this._***REMOVED***atus = true;
    }

    get id(): ***REMOVED***ring {
        return this._id;
    }

    get layerGroup(): LayerGroup {
        return this._layerGroup;
    }

    get sceneLayers(): SceneLayer[] {
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
    con***REMOVED*** req = (await getMissionsHandler()).data;
    for(let i=0; i < req.length; i++) {
        con***REMOVED*** data = req[i]
        con***REMOVED*** id = data.id;
        let mission = new Mission(data.name, id, data.aircraftTakeOffTime);
        mission.scenes = await mission.getMissionScenes();
        missions.push(mission);
    }

    return missions
}

export async function getMissionLayerByID(id: ***REMOVED***ring): Promise<MissionLayerGroup> {
    for(let i=0; i < layers.length; i++) {
        let layer = layers[i];
        if(layer.id === id) {
            return layer;
        }
    }

    return null;
}

/*export async function getMissionScenes(id: ***REMOVED***ring): Promise<Scene[]> {
    let scenes: Scene[] = [];
    con***REMOVED*** req = (await getMissionSceneHandler(id)).data;
    for(let i=0; i < req.length; i++) {
        con***REMOVED*** data = req[i];
        let cString = data.centre.split(",");
        let center = [];
        center.push(cString[0], cString[1]);
        let coord = data.footprint.coordinates;
        scenes.push(new Scene(center, data.countrycode, data.fir***REMOVED***FrameTime, coord
            , data.id, data.name.split(" ")[1]));
    }
    return scenes;
}*/

