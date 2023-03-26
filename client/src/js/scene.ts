import {GeoJSON, Layer} from "leaflet";
import {layers} from "./index";

export class Scene {
    private readonly _center: number[];
    private readonly _countrycode: ***REMOVED***ring;
    private readonly _fir***REMOVED***FrameTime: bigint;
    private readonly _footprint: [];
    private readonly _id: ***REMOVED***ring;
    private readonly _name: ***REMOVED***ring;

    con***REMOVED***ructor(center: number[], countrycode: ***REMOVED***ring, fir***REMOVED***FrameTime: bigint ,footprint: [],
    id: ***REMOVED***ring, name: ***REMOVED***ring) {
        this._center = center;
        this._countrycode = countrycode;
        this._fir***REMOVED***FrameTime = fir***REMOVED***FrameTime;
        this._footprint = footprint;
        this._id = id;
        this._name = name;
    }

    get center(): number[] {
        return this._center;
    }

    get countrycode(): ***REMOVED***ring {
        return this.countrycode;
    }

    get fir***REMOVED***FrameTime(): bigint {
        return this._fir***REMOVED***FrameTime;
    }

    get footprint(): [] {
        return this._footprint;
    }

    get id(): ***REMOVED***ring {
        return this._id;
    }

    get name(): ***REMOVED***ring {
        return this._name;
    }

    GeoJSONCenter(): object {
        let data: GeoJSON.Feature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: this._center
            },
            "properties": {
                id: this._id,
                name: this._name,
                countrycode: this._countrycode,
                fir***REMOVED***FrameTime: this._fir***REMOVED***FrameTime
            }
        }

        return data;
    }

    GeoJSONFootprint(): object {
        let data: GeoJSON.Feature = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: this._footprint
            },
            "properties": {
                id: this._id,
                name: this._name,
                countrycode: this._countrycode,
                fir***REMOVED***FrameTime: this._fir***REMOVED***FrameTime
            }
        }

        return data;
    }
}

export class SceneLayer {
    private readonly _id: ***REMOVED***ring;
    private readonly _parentid: ***REMOVED***ring;
    private readonly _layer: Layer;

    con***REMOVED***ructor(id: ***REMOVED***ring, parentid: ***REMOVED***ring, layer: Layer) {
        this._id = id;
        this._parentid = parentid;
        this._layer = layer;
    }

    get id(): ***REMOVED***ring {
        return this._id;
    }

    get parentid(): ***REMOVED***ring {
        return this._parentid;
    }

    get layer(): Layer {
        return this._layer;
    }
}

export async function getSceneLayerByIO(id: ***REMOVED***ring, sceneLayers: SceneLayer[]): Promise<SceneLayer> {
    for(let i=0; i < sceneLayers.length; i++) {
        let layer = sceneLayers[i];
        if(layer.id === id) {
            return layer;
        }
    }

    return null;
}

export async function getSceneLayerByID(id: ***REMOVED***ring): Promise<SceneLayer> {
    for(let i=0; i < layers.length; i++) {
        let sceneLayers = layers[i].sceneLayers;
        for(let j=0; j < sceneLayers.length; j++) {
            let sceneLayer = sceneLayers[j];
            if(sceneLayer.id === id) {
                return sceneLayer;
            }
        }
    }

    return null;
}
