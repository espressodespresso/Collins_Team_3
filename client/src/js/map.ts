import M = require("./mission.js");
import S = require("./scene.js");
import index = require("./index.js");
import Leaflet = require('leaflet');
import turf = require("@turf/helpers");
const intersect = require("@turf/intersect");
const area = require("@turf/area");
require('leaflet.markercluster');
require('leaflet.markercluster.layersupport');
require('leaflet.heat')

 export enum Levels {
    Marker,
    Footprint,
    Frame
}

// Layer Functions

export async function initLayers(missions: M.Mission[], map: Leaflet.Map): Promise<Leaflet.LayerGroup[]> {
    let localGroupLayers: Leaflet.LayerGroup[] = [];
    for (let i=0; i < missions.length; i++) {
        let mission = missions[i];
        let scenes = mission.scenes;
        let localLayers = [];
        let localSceneLayers: S.SceneLayer[] = [];
        for (let j=0; j < scenes.length; j++) {
            let scene = scenes[j];
            let layer = Leaflet.geoJSON((await scene.GeoJSONCenter() as any)) // ?
                .bindPopup('<h3>' + mission.name + '</h3>' + '<p><b>ID:</b> ' + scene.id + '</p>');
            localLayers.push(layer)
            localSceneLayers.push(new S.SceneLayer(scene.id, mission.id, layer));
        }

        let layerSupportGroup = Leaflet.markerClusterGroup.layerSupport();
        let layerGroup = Leaflet.layerGroup(localLayers);
        layerSupportGroup.addTo(map);
        layerSupportGroup.checkIn(layerGroup);
        index.layers.push(new M.MissionLayerGroup(mission.id, layerGroup, localSceneLayers));
        localGroupLayers.push(layerGroup);
    }

    return localGroupLayers;
}

export async function generateLayers(missions: M.Mission[], level: Levels, map: Leaflet.Map): Promise<Leaflet.LayerGroup[]> {
    let localGroupLayers: Leaflet.LayerGroup[] = [];
    for (let i=0; i < missions.length; i++) {
        let mission = missions[i];
        let existingMissionLayer = await M.getMissionLayerByID(mission.id);
        let missionStatus = true;
        if(existingMissionLayer.status === false) {
            missionStatus = false;
        }
        let scenes = mission.scenes;
        let localLayers = [];
        let localSceneLayers: S.SceneLayer[] = [];
        for (let j=0; j < scenes.length; j++) {
            let scene = scenes[j];
            let existingSceneLayer = await S.getSceneLayerByID(scene.id);
            let sceneStatus = true;
            if(existingSceneLayer.status === false) {
                sceneStatus = false;
            }
            let layer;
            switch (level) {
                case Levels.Marker:
                    layer = Leaflet.geoJSON((await scene.GeoJSONCenter() as any))
                        .bindPopup('<h3>' + mission.name + '</h3>' + '<p><b>ID:</b> ' + scene.id + '</p>');
                    break;
                case Levels.Footprint:
                    layer = Leaflet.geoJSON((await scene.GeoJSONFootprint() as any))
                        .bindPopup('<h3>' + mission.name + '</h3>' + '<p><b>ID:</b> ' + scene.id + '</p>');
                    layer.setStyle({color: '#5c5c5c'})
                    break;
                case Levels.Frame:
                    break;
            }
            localLayers.push(layer);
            let localSceneLayer = new S.SceneLayer(scene.id, mission.id, layer);
            localSceneLayer.status = sceneStatus;
            localSceneLayers.push(localSceneLayer);
        }
        let layerGroup = Leaflet.layerGroup(localLayers);
        if(level === Levels.Marker) {
            let layerSupportGroup = Leaflet.markerClusterGroup.layerSupport();
            layerSupportGroup.addTo(map);
            layerSupportGroup.checkIn(layerGroup);
        }
        let localMissionLayerGroup = new M.MissionLayerGroup(mission.id, layerGroup, localSceneLayers);
        localMissionLayerGroup.status = missionStatus;
        index.layers.push(localMissionLayerGroup);
        localGroupLayers.push(layerGroup);
    }

    return localGroupLayers;
}

async function calculateDrawnCoverage(drawnFeature: turf.Feature<turf.Polygon>, missions: M.Mission[])
    : Promise<[turf.Feature<turf.Polygon | turf.MultiPolygon>, number]> {
     let positions = [];
     for(let i=0; i < missions.length; i++) {
         let scenes = missions[i].scenes;
         for(let j=0; j < scenes.length; j++) {
             let sceneFootprint = scenes[j].footprint;
             positions.push(turf.polygon(sceneFootprint).geometry.coordinates);
         }
     }
     let intersection = intersect.default(drawnFeature, turf.multiPolygon(positions));
     if(intersection !== null) {
         let drawnFeatureArea = area.default(drawnFeature);
         switch (intersection.geometry.type) {
             case "Polygon": {
                 let intersectedArea = area.default(intersection);
                 let percentageCoverage = (100 / drawnFeatureArea) * intersectedArea;
                 return [intersection, percentageCoverage];
             }
             case "MultiPolygon": {
                 let intersectingTotalArea: number = 0;
                 let intersectionCoords = intersection.geometry.coordinates;
                 for (let i = 0; i < intersectionCoords.length; i++) {
                     intersectingTotalArea += area.default(turf.polygon(intersectionCoords[i]));
                 }
                 let percentageCoverage = (100 / drawnFeatureArea) * intersectingTotalArea;
                 return [intersection, percentageCoverage];
             }
         }
     }
}

export async function calculateHeatmapCoverage(missions: M.Mission[]) {
    let heatMapPoints = [];
    let areaOfScenes = [];
    for(let i=0; i < missions.length; i++) {
        let scenes = missions[i].scenes;
        for(let j=0; j < scenes.length; j++){
            let scene = scenes[j];
            areaOfScenes.push({
                area: area(turf.polygon(scene.footprint)),
                lat: scene.center[1],
                lng: scene.center[0]
            });
        }
    }

    let intensityRef = Math.max.apply(Math, areaOfScenes);
    for(let i=0; i < areaOfScenes.length; i++) {
        let data = areaOfScenes[i];
        let intensity = data.area / intensityRef;
        heatMapPoints.push([data.lat, data.lng, intensity])
    }
    return heatMapPoints;
}

// Map modification functions

export async function clearMapLayers(map: Leaflet.Map): Promise<void> {
     for(let i=0; i < index.layers.length; i++) {
         let missionLayer = index.layers[i];
         map.removeLayer(missionLayer.layerGroup);
     }
}

export function addLayersToMap(localLayers: Leaflet.LayerGroup[], clear: boolean, map: Leaflet.Map): void {
     if(clear) {
        for(let i=0; i < index.layers.length; i++) {
            map.removeLayer(index.layers[i].layerGroup);
        }
     }
     for(let i=0; i < localLayers.length; i++) {
         let layer = localLayers[i];
         layer.addTo(map);
     }
}

// Map relevant event listeners

let prevZoomLevel = 0;

export function initZoomEvent(map: Leaflet.Map, level: Levels, missions: M.Mission[]): void {
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

export function initDrawEvent(map: Leaflet.Map, drawFeatures: Leaflet.FeatureGroup, missions: M.Mission[]): void {
    map.on(Leaflet.Draw.Event.CREATED, async function (e) {
        let layer = e.layer;
        let drawGeoJSON = layer.toGeoJSON();
        switch (drawGeoJSON.geometry.type) {
            case "Polygon":
                let [calculatedFeature, percentageCoverage] = await calculateDrawnCoverage(turf.polygon(drawGeoJSON.geometry.coordinates), missions);
                let calculatedLayer = Leaflet.geoJSON(calculatedFeature)
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