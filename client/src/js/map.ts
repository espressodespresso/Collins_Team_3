import {LayerGroup, GeoJSON, Map} from "leaflet";
import {getMissionLayerByID, Mission, MissionLayerGroup} from "./mission";
import {getSceneLayerByID, SceneLayer} from "./scene";
import {layers} from "./index";
import {Feature, MultiPolygon, multiPolygon, polygon, Polygon} from "@turf/helpers";
import intersect from "@turf/intersect";
import area from "@turf/area";

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
            let layer = new GeoJSON((await scene.GeoJSONCenter() as any));
            localLayers.push(layer)
            localSceneLayers.push(new SceneLayer(scene.id, mission.id, layer));
        }

        let layerGroup = new LayerGroup(localLayers);
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
                    layer = new GeoJSON((await scene.GeoJSONCenter() as any));
                    break;
                case Levels.Footprint:
                    layer = new GeoJSON((await scene.GeoJSONFootprint() as any));
                    layer.setStyle({color: '#5c5c5c'})
                    break;
                case Levels.Frame:
                    break;
            }
            localLayers.push(layer);
            let localSceneLayer = new SceneLayer(scene.id, mission.id, layer);
            localSceneLayer.***REMOVED***atus = sceneStatus;
            localSceneLayers.push(localSceneLayer);
        }
        let layerGroup = new LayerGroup(localLayers);
        let localMissionLayerGroup = new MissionLayerGroup(mission.id, layerGroup, localSceneLayers);
        localMissionLayerGroup.***REMOVED***atus = missionStatus;
        layers.push(localMissionLayerGroup);
        localGroupLayers.push(layerGroup);
    }

    return localGroupLayers;
}

export async function calculateDrawnCoverage(drawnFeature: Feature<Polygon>, missions: Mission[])
    : Promise<Feature<Polygon | MultiPolygon>> {
     let positions = [];
     for(let i=0; i < missions.length; i++) {
         let scenes = missions[i].scenes;
         for(let j=0; j < scenes.length; j++) {
             let sceneFootprint = scenes[j].footprint;
             positions.push(polygon(sceneFootprint).geometry.coordinates);
         }
     }
     let intersection = intersect(drawnFeature, multiPolygon(positions));
     if(intersection !== null) {
         let drawnFeatureArea = area(drawnFeature);
         switch (intersection.geometry.type) {
             case "Polygon":
                 let intersectedArea = area(intersection);
                 console.log("Percentage coverage : " + (100 / drawnFeatureArea) * intersectedArea);
                 return intersection;
             case "MultiPolygon":
                 let intersectingTotalArea: number = 0;
                 let intersectionCoords = intersection.geometry.coordinates;
                 for(let i=0; i < intersectionCoords.length; i++) {
                     intersectingTotalArea += area(polygon(intersectionCoords[i]));
                 }
                 console.log("Percentage coverage : " + (100 / drawnFeatureArea) * intersectingTotalArea);
                 return intersection;
         }
     }
}

export async function clearMapLayers(map: Map): Promise<void> {
     for(let i=0; i < layers.length; i++) {
         let missionLayer = layers[i];
         map.removeLayer(missionLayer.layerGroup);
     }
}

export function addLayersToMap(localLayers: LayerGroup[], clear: boolean, map: Map) {
     if(clear) {
        for(let i=0; i < layers.length; i++) {
            map.removeLayer(layers[i].layerGroup);
        }
     }
     for(let i=0; i < localLayers.length; i++) {
         let layer = localLayers[i];
         layer.addTo(map);
     }
}