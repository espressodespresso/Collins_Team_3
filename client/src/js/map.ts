import M = require("./mission.js");
import S = require("./scene.js");
import index = require("./index.js");
import Leaflet = require('leaflet');
import turf = require("@turf/helpers");
con***REMOVED*** intersect = require("@turf/intersect");
con***REMOVED*** area = require("@turf/area");
require('leaflet.markerclu***REMOVED***er');
require('leaflet.markerclu***REMOVED***er.layersupport');
require('leaflet.heat')
import fs = require("fs")

 export enum Levels {
    Marker,
    Footprint,
    Frame
}

export class Map {
    private _map: Leaflet.Map;
    private _drawFeatures: Leaflet.FeatureGroup;
    private _heatMapSource: Leaflet.HeatLayer;
    private _prevZoomLevel: number;

    con***REMOVED***ructor() {
        this._prevZoomLevel = 0;
        this.initMap();
    }

    get map(): Leaflet.Map {
        return this._map;
    }

    get drawFeatures(): Leaflet.FeatureGroup {
        return this._drawFeatures;
    }

    get heatMapSource(): Leaflet.HeatLayer {
        return this._heatMapSource;
    }

    initMap() {
        this._map = new Leaflet.Map('map', {
            zoomControl: false,
            center: [54.247468, -4.438477],
            zoom: 6
        })

        Leaflet.tileLayer('https://tile.open***REMOVED***reetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.open***REMOVED***reetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this._map)

        this._map.addControl(new Leaflet.Control.Draw({
            position: "bottomright"
        }));

        this._drawFeatures = new Leaflet.FeatureGroup();
        this._map.addLayer(this._drawFeatures);
    }

    // Layer Functions

    async initLayers(missions: M.Mission[]): Promise<void> {
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

            let layerSupportGroup = Leaflet.markerClu***REMOVED***erGroup.layerSupport();
            let layerGroup = Leaflet.layerGroup(localLayers);
            layerSupportGroup.addTo(this._map);
            layerSupportGroup.checkIn(layerGroup);
            index.layers.push(new M.MissionLayerGroup(mission.id, layerGroup, localSceneLayers));
            localGroupLayers.push(layerGroup);
        }

        this.addLayersToMap(localGroupLayers, false);
    }

    async generateLayers(missions: M.Mission[], level: Levels): Promise<Leaflet.LayerGroup[]> {
        let localGroupLayers: Leaflet.LayerGroup[] = [];
        for (let i=0; i < missions.length; i++) {
            let mission = missions[i];
            let exi***REMOVED***ingMissionLayer = await M.getMissionLayerByID(mission.id);
            let missionStatus = true;
            if(exi***REMOVED***ingMissionLayer.***REMOVED***atus === false) {
                missionStatus = false;
            }
            let scenes = mission.scenes;
            let localLayers = [];
            let localSceneLayers: S.SceneLayer[] = [];
            for (let j=0; j < scenes.length; j++) {
                let scene = scenes[j];
                let exi***REMOVED***ingSceneLayer = await S.getSceneLayerByID(scene.id);
                let sceneStatus = true;
                if(exi***REMOVED***ingSceneLayer.***REMOVED***atus === false) {
                    sceneStatus = false;
                }
                let layer;
                switch (level) {
                    case Levels.Marker:
                        layer = Leaflet.geoJSON((await scene.GeoJSONCenter() as any))
                            .bindPopup('<h3>' + mission.name + '</h3>' + '<h5>ID: ' + scene.id + '</h5>');
                        break;
                    case Levels.Footprint:
                        layer = Leaflet.geoJSON((await scene.GeoJSONFootprint() as any))
                            .bindPopup('<h3>' + mission.name + '</h3>' + '<h5>ID: ' + scene.id + '</h5>');
                        layer.setStyle({color: '#5c5c5c'})
                        break;
                    case Levels.Frame:
                        break;
                }
                localLayers.push(layer);
                let localSceneLayer = new S.SceneLayer(scene.id, mission.id, layer);
                localSceneLayer.***REMOVED***atus = sceneStatus;
                localSceneLayers.push(localSceneLayer);
            }
            let layerGroup = Leaflet.layerGroup(localLayers);
            if(level === Levels.Marker) {
                let layerSupportGroup = Leaflet.markerClu***REMOVED***erGroup.layerSupport();
                layerSupportGroup.addTo(this._map);
                layerSupportGroup.checkIn(layerGroup);
            }
            let localMissionLayerGroup = new M.MissionLayerGroup(mission.id, layerGroup, localSceneLayers);
            localMissionLayerGroup.***REMOVED***atus = missionStatus;
            index.layers.push(localMissionLayerGroup);
            localGroupLayers.push(layerGroup);
        }

        return localGroupLayers;
    }

    async calculateDrawnCoverage(drawnFeature: turf.Feature<turf.Polygon>, missions: M.Mission[])
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

    async calculateHeatmapCoverage(missions: M.Mission[]) {
        let heatMapPoints = [];
        let areaOfScenes = [];
        for(let i=0; i < missions.length; i++) {
            let scenes = missions[i].scenes;
            for(let j=0; j < scenes.length; j++){
                let scene = scenes[j];
                areaOfScenes.push({
                    area: area.default(turf.polygon(scene.footprint)),
                    lat: scene.center[1],
                    lng: scene.center[0]
                });
            }
        }

        let areas = [];
        for(let i=0; i < areaOfScenes.length; i++) {
            areas.push(areaOfScenes[i]["area"]);
        }
        let intensityRef = Math.max.apply(Math, areas);

        for(let i=0; i < areaOfScenes.length; i++) {
            let data = areaOfScenes[i];
            let intensity = data.area / intensityRef;
            heatMapPoints.push([data.lat, data.lng, intensity])
        }

        this._heatMapSource = Leaflet.heatLayer(heatMapPoints
            , { radius: 40, blur: 20, maxZoom: 6 }).addTo(this._map);
    }

    // Map modification functions

    async clearMapLayers(): Promise<void> {
        for(let i=0; i < index.layers.length; i++) {
            let missionLayer = index.layers[i];
            this._map.removeLayer(missionLayer.layerGroup);
        }
    }

    addLayersToMap(localLayers: Leaflet.LayerGroup[], clear: boolean): void {
        if(clear) {
            for(let i=0; i < index.layers.length; i++) {
                this._map.removeLayer(index.layers[i].layerGroup);
            }
        }
        for(let i=0; i < localLayers.length; i++) {
            let layer = localLayers[i];
            layer.addTo(this._map);
        }
    }

    // Map relevant event li***REMOVED***eners

    initZoomEvent(level: Levels, missions: M.Mission[]): void {
        let map = this;
        this._map.on("zoomend", async function (e) {
            let zoomLevel = map.map.getZoom();
            if(zoomLevel > 9 && zoomLevel < 12 && level !== Levels.Footprint) {
                level = Levels.Footprint;
                let generatedLayers = await map.generateLayers(missions, level);
                map.addLayersToMap(generatedLayers, true);
            } else if(zoomLevel > 12 && level !== Levels.Frame) {
                level = Levels.Frame;
                let generatedLayers = await map.generateLayers(missions, level);
                map.addLayersToMap(generatedLayers, true);
            } else if(zoomLevel < 10 && level !== Levels.Marker) {
                level = Levels.Marker;
                let generatedLayers = await map.generateLayers(missions, level);
                map.addLayersToMap(generatedLayers, true);
            }
        });
    }

    initDrawEvent(missions: M.Mission[]): void {
        let map = this;
        this._map.on(Leaflet.Draw.Event.CREATED, async function (e) {
            let layer = e.layer;
            let drawGeoJSON = layer.toGeoJSON();
            switch (drawGeoJSON.geometry.type) {
                case "Polygon":
                    let [calculatedFeature, percentageCoverage] = await map.calculateDrawnCoverage(turf.polygon(drawGeoJSON.geometry.coordinates), missions);
                    let calculatedLayer = Leaflet.geoJSON(calculatedFeature);
                    console.log(percentageCoverage);
                    calculatedLayer.setStyle({color: '#ffc107'});
                    await map.clearMapLayers();
                    map.drawFeatures.addLayer(calculatedLayer);
                    layer.setStyle({color: '#5c5c5c'})
                    layer.bindPopup('<h3>Percentage Coverage</h3>' + '<h5> ' + percentageCoverage + '%</h5>')
                    map.drawFeatures.addLayer(layer);
                    break;
                //await calculateDrawnCoverage(polygon(drawGeoJSON.geometry.coordinates), missions)
                //GeoJSON.Feature
            }
        });
    }

    removeSeaLayers(missions: M.Mission[]){
        let positions = [];
        for(let i=0; i < missions.length; i++) {
            let scenes = missions[i].scenes;
            for(let j=0; j < scenes.length; j++) {
                let sceneFootprint = scenes[j].footprint;
                positions.push(turf.polygon(sceneFootprint).geometry.coordinates);
            }
        }
        let ukBorder = fs.readFileSync("UkBorders.json");
        Leaflet.tileLayer("ukBorder").addTo(this._map);

        // GEO LAYERS COMBINED TO MAKE UK BORDERS

        for(let i=0; i < missions.length; i++){
            let intersection = intersect.default(ukBorder, turf.multiPolygon(positions[i]))
            if (intersection === null){
                this._map.removeLayer(positions[i].layerGroup);
            }
        }
    }
    calculateTotalCoverageArea(missions: M.Mission[]) {
        let positions = [];
        let ukBorders; // GEO LAYERS COMBINED TO MAKE UK BORDERS
        for (let i = 0; i < missions.length; i++) {
            let scenes = missions[i].scenes;
            for (let j = 0; j < scenes.length; j++) {
                let sceneFootprint = scenes[j].footprint;
                positions.push(turf.polygon(sceneFootprint).geometry.coordinates);
            }
        }
        let intersection = intersect.default(ukBorders, turf.multiPolygon(positions));
        if (intersection !== null) {
            let ukArea = area.default(ukBorders);
            let intersectedArea = area.default(intersection);
            let percentageCoverage = (100 / ukArea) * intersectedArea;
            return percentageCoverage;
        }
    }
}