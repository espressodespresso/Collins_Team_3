import {Mission, MissionLayerGroup} from "./mission";
import {SceneLayer} from "./scene";
import {layers} from "./index";
import {LayerGroup} from "leaflet";

enum Levels {
    Marker,
    Footprint,
    Frame
}

export async function initLayers(missions: Mission[], level: Levels): Promise<LayerGroup[]> {
    let localGroupLayers:LayerGroup[] = [];
    for (let i=0; i < missions.length; i++) {
        let misson = missions[i];
        let scenes = misson.scenes;
        let localLayers = [];
        let localSceneLayers: SceneLayer[] = [];
        for (let j=0; j < scenes.length; j++) {
            let scene = scenes[j];
            switch (level) {
                case Levels.Marker:

                    break;
                case Levels.Footprint:
                    break;
                case Levels.Frame:
                    break
            }
            //footprints.push(new L.GeoJSON((await scene.GeoJSONFootprint() as any)))
            let layer = new L.GeoJSON((await scene.GeoJSONCenter() as any));
            localLayers.push(layer)
            localSceneLayers.push(new SceneLayer(scene.id, misson.id, layer));
        }

        let layerGroup = L.layerGroup(localLayers);
        layers.push(new MissionLayerGroup(misson.id, layerGroup, localSceneLayers));
        localGroupLayers.push(layerGroup);
    }

    return localGroupLayers;
}