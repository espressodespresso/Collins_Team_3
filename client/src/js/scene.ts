import {GeoJSON, Layer} from "leaflet";

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
        return this.countrycode;
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
                firstFrameTime: this._firstFrameTime
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
                firstFrameTime: this._firstFrameTime
            }
        }

        return data;
    }
}

export class SceneLayer {
    private readonly _id: string;
    private readonly _layer: Layer;

    constructor(id: string, layer: Layer) {
        this._id = id;
        this._layer = layer;
    }

    get id(): string {
        return this._id;
    }

    get layer(): Layer {
        return this._layer;
    }
}

