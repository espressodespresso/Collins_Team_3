import {getMissionSceneHandler, getMissionsHandler} from "./services/request";
import {Scene, SceneLayer} from "./scene";
import {LayerGroup} from "leaflet";

export class Mission {
    private readonly _name: string;
    private readonly _id: string;
    private readonly _aircraftTakeOffTime: bigint;
    private _scenes: Scene[];

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

    get scenes(): Scene[] {
        return this._scenes;
    }

    set scenes(Scenes: Scene[]) {
        this._scenes = Scenes;
    }

    async getMissionScenes(): Promise<Scene[]> {
        let scenes: Scene[] = [];
        const req = (await getMissionSceneHandler(this.id)).data;
        for (let i = 0; i < req.length; i++) {
            const data = req[i];
            let cString = data.centre.split(",");
            let center = [];
            center.push(cString[1], cString[0]);
            let coord = data.footprint.coordinates;
            scenes.push(new Scene(center, data.countrycode, data.firstFrameTime, coord
                , data.id, data.name.split(" ")[1]));
        }
        console.log(scenes)
        return scenes;
    }
}

export class MissionLayerGroup {
    private readonly _id: string;
    private readonly _layerGroup: LayerGroup;
    private readonly _sceneLayers: SceneLayer[];

    constructor(id: string, layerGroup: LayerGroup, sceneLayers: SceneLayer[]) {
        this._id = id;
        this._layerGroup = layerGroup;
        this._sceneLayers = sceneLayers;
    }

    get id(): string {
        return this._id;
    }

    get layerGroup(): LayerGroup {
        return this._layerGroup;
    }

    get sceneLayers(): SceneLayer[] {
        return this._sceneLayers;
    }
}

export async function getMissions(): Promise<Mission[]> {
    let missions: Mission[] = [];
    const req = (await getMissionsHandler()).data;
    for(let i=0; i < req.length; i++) {
        const data = req[i]
        const id = data.id;
        let mission = new Mission(data.name, id, data.aircraftTakeOffTime);
        mission.scenes = await mission.getMissionScenes();
        missions.push(mission);
    }

    return missions
}

/*export async function getMissionScenes(id: string): Promise<Scene[]> {
    let scenes: Scene[] = [];
    const req = (await getMissionSceneHandler(id)).data;
    for(let i=0; i < req.length; i++) {
        const data = req[i];
        let cString = data.centre.split(",");
        let center = [];
        center.push(cString[0], cString[1]);
        let coord = data.footprint.coordinates;
        scenes.push(new Scene(center, data.countrycode, data.firstFrameTime, coord
            , data.id, data.name.split(" ")[1]));
    }
    return scenes;
}*/

