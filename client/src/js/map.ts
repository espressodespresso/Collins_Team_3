import {getMissionLayerByID, Mission, MissionLayerGroup} from "./mission";
import {getSceneLayerByID, SceneLayer} from "./scene";
import {layers} from "./index";
import {LayerGroup} from "leaflet";

export enum Levels {
    Marker,
    Footprint,
    Frame
}

export async function initLayers(missions: Mission[]): Promise<LayerGroup[]> {
    let localGroupLayers:LayerGroup[] = [];
    for (let i=0; i < missions.length; i++) {
        let mission = missions[i];
        let scenes = mission.scenes;
        let localLayers = [];
        let localSceneLayers: SceneLayer[] = [];
        for (let j=0; j < scenes.length; j++) {
            let scene = scenes[j];
            //footprints.push(new L.GeoJSON((await scene.GeoJSONFootprint() as any)))
            let layer = new L.GeoJSON((await scene.GeoJSONCenter() as any));
            localLayers.push(layer)
            localSceneLayers.push(new SceneLayer(scene.id, mission.id, layer));
        }

        let layerGroup = L.layerGroup(localLayers);
        layers.push(new MissionLayerGroup(mission.id, layerGroup, localSceneLayers));
        localGroupLayers.push(layerGroup);
    }

    return localGroupLayers;
}

export async function generateLayers(missions: Mission[], level: Levels): Promise<LayerGroup[]> {
    let localGroupLayers:LayerGroup[] = [];
    for (let i=0; i < missions.length; i++) {
        let mission = missions[i];
        let exi***REMOVED***ingMissionLayer = await getMissionLayerByID(mission.id);
        let missionStatus = true;
        if(exi***REMOVED***ingMissionLayer.***REMOVED***atus === false) {
            missionStatus = false;
        }
        let scenes = mission.scenes;
        let localLayers = [];
        let localSceneLayers: SceneLayer[] = [];
        for (let j=0; j < scenes.length; j++) {
            let scene = scenes[j];
            let exi***REMOVED***ingSceneLayer = await getSceneLayerByID(scene.id);
            let sceneStatus = true;
            if(exi***REMOVED***ingSceneLayer.***REMOVED***atus === false) {
                sceneStatus = false;
            }
            let layer;
            switch (level) {
                case Levels.Marker:
                    layer = new L.GeoJSON((await scene.GeoJSONCenter() as any));
                    break;
                case Levels.Footprint:
                    layer = new L.GeoJSON((await scene.GeoJSONFootprint() as any));
                    break;
                case Levels.Frame:
                    break;
            }
            localLayers.push(layer);
            let localSceneLayer = new SceneLayer(scene.id, mission.id, layer);
            localSceneLayer.***REMOVED***atus = sceneStatus;
            localSceneLayers.push(localSceneLayer);
        }
        let layerGroup = L.layerGroup(localLayers);
        let localMissionLayerGroup = new MissionLayerGroup(mission.id, layerGroup, localSceneLayers);
        localMissionLayerGroup.***REMOVED***atus = missionStatus;
        layers.push(localMissionLayerGroup);
        localGroupLayers.push(layerGroup);
    }

    return localGroupLayers;
}