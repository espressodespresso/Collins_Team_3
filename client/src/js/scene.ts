import Leaflet = require('leaflet');
import index = require("./index.js");

export class Scene {
    private readonly _center: number[];
    private readonly _countrycode: string;
    private readonly _firstFrameTime: bigint;
    private readonly _footprint: [];
    private readonly _id: string;
    private readonly _name: string;

    constructor(center: number[], countrycode: string, firstFrameTime: bigint ,footprint: [],
    id: string, name: string) {
        this._center = center;
        this._countrycode = countrycode;
        this._firstFrameTime = firstFrameTime;
        this._footprint = footprint;
        this._id = id;
        this._name = name;
    }

    get center(): number[] {
        return this._center;
    }

    get countrycode(): string {
        return this._countrycode;
    }

    get firstFrameTime(): bigint {
        return this._firstFrameTime;
    }

    get footprint(): [] {
        return this._footprint;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
        return this._name;
    }


    GeoJSONCenter(): object {
        let data = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: this._center
            },
            "properties": {
                id: this._id,
                name: this._name,
                countrycode: this._countrycode,
                firstFrameTime: this._firstFrameTime
            }
        }

        return data;
    }

    GeoJSONFootprint(): object {
        let data = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: this._footprint
            },
            "properties": {
                id: this._id,
                name: this._name,
                countrycode: this._countrycode,
                firstFrameTime: this._firstFrameTime
            }
        }

        return data;
    }

}

export class SceneLayer {
    private readonly _id: string;
    private readonly _parentid: string;
    private readonly _layer: Leaflet.Layer;
    private _status: boolean;

    constructor(id: string, parentid: string, layer: Leaflet.Layer) {
        this._id = id;
        this._parentid = parentid;
        this._layer = layer;
        this._status = true;
    }

    get id(): string {
        return this._id;
    }

    get parentid(): string {
        return this._parentid;
    }

    get layer(): Leaflet.Layer {
        return this._layer;
    }

    get status(): boolean {
        return this._status;
    }

    set status(value: boolean) {
        this._status = value;
    }
}

export async function getSceneLayerByIO(id: string, sceneLayers: SceneLayer[]): Promise<SceneLayer> {
    for(let i=0; i < sceneLayers.length; i++) {
        let layer = sceneLayers[i];
        if(layer.id === id) {
            return layer;
        }
    }

    return null;
}

export async function getSceneLayerByID(id: string): Promise<SceneLayer> {
    for(let i=0; i < index.layers.length; i++) {
        let sceneLayers = index.layers[i].sceneLayers;
        for(let j=0; j < sceneLayers.length; j++) {
            let sceneLayer = sceneLayers[j];
            if(sceneLayer.id === id) {
                return sceneLayer;
            }
        }
    }

    return null;
}
