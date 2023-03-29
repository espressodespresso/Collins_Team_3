import {LayerGroup, GeoJSON, Map, Draw, FeatureGroup} from "leaflet";
import {getMissionLayerByID, Mission, MissionLayerGroup} from "./mission";
import {getSceneLayerByID, SceneLayer} from "./scene";
import {layers} from "./index";
import {Feature, MultiPolygon, multiPolygon, polygon, Polygon} from "@turf/helpers";
import intersect from "@turf/intersect";
import area from "@turf/area";
import 'leaflet.markerclu***REMOVED***er'
import 'leaflet.markerclu***REMOVED***er.layersupport'

 export enum Levels {
    Marker,
    Footprint,
    Frame
}

// Layer Functions

export async function initLayers(missions: Mission[], map: Map): Promise<LayerGroup[]> {
    let localGroupLayers:LayerGroup[] = [];
    for (let i=0; i < missions.length; i++) {
        let mission = missions[i];
        let scenes = mission.scenes;
        let localLayers = [];
        let localSceneLayers: SceneLayer[] = [];
        for (let j=0; j < scenes.length; j++) {
            let scene = scenes[j];
            let layer = new GeoJSON((await scene.GeoJSONCenter() as any))
                .bindPopup('<h3>' + mission.name + '</h3>' + '<p><b>ID:</b> ' + scene.id + '</p>');
            localLayers.push(layer)
            localSceneLayers.push(new SceneLayer(scene.id, mission.id, layer));
        }

        // Using due to the lack of export support with Leaflet clu***REMOVED***er plugin
        let layerSupportGroup = window['L'].markerClu***REMOVED***erGroup.layerSupport();
        let layerGroup = new LayerGroup(localLayers);
        layerSupportGroup.addTo(map);
        layerSupportGroup.checkIn(layerGroup);
        layers.push(new MissionLayerGroup(mission.id, layerGroup, localSceneLayers));
        localGroupLayers.push(layerGroup);
    }

    return localGroupLayers;
}

export async function generateLayers(missions: Mission[], level: Levels, map: Map): Promise<LayerGroup[]> {
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
                    layer = new GeoJSON((await scene.GeoJSONCenter() as any))
                        .bindPopup('<h3>' + mission.name + '</h3>' + '<p><b>ID:</b> ' + scene.id + '</p>');
                    break;
                case Levels.Footprint:
                    layer = new GeoJSON((await scene.GeoJSONFootprint() as any))
                        .bindPopup('<h3>' + mission.name + '</h3>' + '<p><b>ID:</b> ' + scene.id + '</p>');
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
        if(level === Levels.Marker) {
            // Using due to the lack of export support with Leaflet clu***REMOVED***er plugin
            let layerSupportGroup = window['L'].markerClu***REMOVED***erGroup.layerSupport();
            layerSupportGroup.addTo(map);
            layerSupportGroup.checkIn(layerGroup);
        }
        let localMissionLayerGroup = new MissionLayerGroup(mission.id, layerGroup, localSceneLayers);
        localMissionLayerGroup.***REMOVED***atus = missionStatus;
        layers.push(localMissionLayerGroup);
        localGroupLayers.push(layerGroup);
    }

    return localGroupLayers;
}

async function calculateDrawnCoverage(drawnFeature: Feature<Polygon>, missions: Mission[])
    : Promise<[Feature<Polygon | MultiPolygon>, number]> {
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
             case "Polygon": {
                 let intersectedArea = area(intersection);
                 let percentageCoverage = (100 / drawnFeatureArea) * intersectedArea;
                 return [intersection, percentageCoverage];
             }
             case "MultiPolygon": {
                 let intersectingTotalArea: number = 0;
                 let intersectionCoords = intersection.geometry.coordinates;
                 for (let i = 0; i < intersectionCoords.length; i++) {
                     intersectingTotalArea += area(polygon(intersectionCoords[i]));
                 }
                 let percentageCoverage = (100 / drawnFeatureArea) * intersectingTotalArea;
                 return [intersection, percentageCoverage];
             }
         }
     }
}

// Map modification functions

export async function clearMapLayers(map: Map): Promise<void> {
     for(let i=0; i < layers.length; i++) {
         let missionLayer = layers[i];
         map.removeLayer(missionLayer.layerGroup);
     }
}

export function addLayersToMap(localLayers: LayerGroup[], clear: boolean, map: Map): void {
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

// Map relevant event li***REMOVED***eners

export function initZoomEvent(map: Map, level: Levels, missions: Mission[]): void {
    map.on("zoomend", async function (e) {
        let zoomLevel = map.getZoom();
        if(zoomLevel > 9 && zoomLevel < 12 && level !== Levels.Footprint) {
            level = Levels.Footprint;
            let generatedLayers = await generateLayers(missions, level, map);
            addLayersToMap(generatedLayers, true, map);
        } else if(zoomLevel > 12 && level !== Levels.Frame) {
            level = Levels.Frame;
            let generatedLayers = await generateLayers(missions, level, map);
            addLayersToMap(generatedLayers, true, map);
        } else if(zoomLevel < 10 && level !== Levels.Marker) {
            level = Levels.Marker;
            let generatedLayers = await generateLayers(missions, level, map);
            addLayersToMap(generatedLayers, true, map);
        }
    });
}

export function initDrawEvent(map: Map, drawFeatures: FeatureGroup, missions: Mission[]): void {
    map.on(Draw.Event.CREATED, async function (e) {
        let layer = e.layer;
        let drawGeoJSON = layer.toGeoJSON();
        switch (drawGeoJSON.geometry.type) {
            case "Polygon":
                let [calculatedFeature, percentageCoverage] = await calculateDrawnCoverage(polygon(drawGeoJSON.geometry.coordinates), missions);
                let calculatedLayer = new GeoJSON(calculatedFeature)
                    .bindPopup('<h3>Percentage Coverage</h3>' + '<p> ' + percentageCoverage + '%</p>');
                console.log(percentageCoverage);
                calculatedLayer.setStyle({color: '#ffc107'});
                await clearMapLayers(map);
                drawFeatures.addLayer(calculatedLayer);
                layer.setStyle({color: '#5c5c5c'})
                drawFeatures.addLayer(layer);
                break;
                //await calculateDrawnCoverage(polygon(drawGeoJSON.geometry.coordinates), missions)
                //GeoJSON.Feature
        }
    });
}