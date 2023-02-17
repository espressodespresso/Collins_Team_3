var map = L.map('map', {zoomControl: false}).setView([54.247468, -4.438477], 6);
var layerControl = L.control.layers().addTo(map);
/*var geolayer = new L.GeoJSON(object, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<h1>'+feature.properties.id+'</h1><p>name: '+feature.properties.name+'</p><p>producturl: '+feature.producturl);
    }
}).addTo(map);*/


L.tileLayer('https://tile.open***REMOVED***reetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.open***REMOVED***reetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var options = {
    position: 'bottomright',
    drawMarker: true,
    drawPolyline: true,
    drawRectangle: true,
    drawCircle: true,
    cutPolygon: true,
    editMode: true,
    rmovalMode: true,
};

var searchLayer = L.layerGroup().addTo(map);
//... adding data in searchLayer ...
map.addControl( new L.Control.Search({layer: searchLayer,position:'topright'}) );
//searchLayer is a L.LayerGroup contains searched markers

map.pm.addControls(options);
map.pm.disableDraw('Poly');
map.on('pm:create', function (e) {
    console.log(e);
    e.shape;
    e.layer;
});

con***REMOVED*** login = async (username, password) => {
    let ***REMOVED***atus = true;
    con***REMOVED*** loginURL = 'http://localho***REMOVED***:3000/login'
    con***REMOVED*** res = await fetch(loginURL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.***REMOVED***ringify({"username": username, "password": password})
    })
    con***REMOVED*** resText = await res.text()
    con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
    con***REMOVED*** jwt = resJSON.token
    if(jwt){
        localStorage.jwt = jwt
    }else{
        ***REMOVED***atus = false
    }
    return ***REMOVED***atus
}

/*async function getMissionsReque***REMOVED***() {
    con***REMOVED*** getMissionsURL = 'http://localho***REMOVED***:3000/api/missions';
    con***REMOVED*** getMissionsResponse = await fetch(getMissionsURL, {
        method: "GET"
    });
    return await getMissionsResponse.json()
}*/

con***REMOVED*** getMissionsReque***REMOVED*** = async () => {
    con***REMOVED*** getMissionsURL = 'http://localho***REMOVED***:3000/api/missions'
    con***REMOVED*** jwt = localStorage.jwt
    con***REMOVED*** res = await fetch(getMissionsURL, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    con***REMOVED*** resText = await res.text()
    con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
    //con***REMOVED*** missions = resJSON.data

    return resJSON
}


/*async function getMissionReque***REMOVED***(id) {
    con***REMOVED*** getMissionURL = 'http://localho***REMOVED***:3000/api/missions/' + id;
    con***REMOVED*** getMissionResponse = await fetch(getMissionURL, {
        method: "GET"
    })
    return await getMissionResponse.json()
}*/

con***REMOVED*** getMissionReque***REMOVED*** = async(id) => {
    con***REMOVED*** getMissionSceneURL = `http://localho***REMOVED***:3000/api/missions/${id}`
    con***REMOVED*** jwt = localStorage.jwt
    con***REMOVED*** res = await fetch(getMissionSceneURL, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    con***REMOVED*** resText = await res.text()
    con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
    //con***REMOVED*** scenes = resJSON.data

    return resJSON;
}

async function getMissions() {
    let value = await getMissionsReque***REMOVED***();
    let missions = [{}]
    try {

        for (let i = 0; i < value.data.length; i++) {
            let valueData = value.data[i]
            let id = valueData.id;
            let mission = await getMissionReque***REMOVED***(id)
            mission["missionname"] = valueData.name
            mission["aircraftTakeOffTime"] = valueData.aircraftTakeOffTime
            //localStorage.setItem(valueData.name, id)
            missions.push(mission);
        }
    } catch (e) {
        console.error(e)
    }

    return missions
}

async function LayerMissions() {
    con***REMOVED*** missions = await getMissions()
    for(let i=1; i < missions.length; i++) {
        let [mission] = await Promise.all([missions[i]]);
        console.log(mission)
        let missionData = mission.data;
        var ul = document.getElementById("sidebar")
        let li = document.createElement("li")
        li.appendChild(document.createTextNode(mission.missionname))
        ul.appendChild(li)
        let marks = []
        for(let j=0; j < missionData.length; j++) {
            //marks.push(addMarker(missionData[j], mission.missionname, mission.aircraftTakeOffTime))
            // Kinda broken
            marks.push(addToGeoLayer(sceneToGeoJSONCentre(missionData[j]), mission.missionname, mission.aircraftTakeOffTime))
        }
        let marksGroup = L.layerGroup(marks)
        console.log(marks)
        layerControl.addOverlay(marksGroup, mission.missionname)
    }
}

LayerMissions()

function addMarker(data, missionname, takeofftime) {
    let centre = data.centre.split(",")
    return L.marker([centre[0],centre[1]], {
        title: missionname + ' ' + data.name
    }).bindPopup('<h1>'+ missionname + ' ' + data.name + '</h1><p>Location: ' + data.countrycode + ' '
        + data.centre + '</p><p>Aircraft Takeoff Time: ' + takeofftime + '</p><p>ID: ' + data.id + '</p>');
}

function addToGeoLayer(data, missionname, takeofftime){
    return new L.GeoJSON(data).bindPopup('<h1>'+ missionname + ' ' + data.name + '</h1><p>Location: ' + data.countrycode + ' '
        + data.centre + '</p><p>Aircraft Takeoff Time: ' + takeofftime + '</p><p>ID: ' + data.id + '</p>');
}

/*
function addToGeoLayer(data, missionname, takeofftime){
    var workplease = new L.GeoJSON(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<h1>'+ missionname + ' ' + data.name + '</h1><p>Location: ' + data.countrycode + ' '
                + data.centre + '</p><p>Aircraft Takeoff Time: ' + takeofftime + '</p><p>ID: ' + data.id + '</p>');
        }
    }).addTo(map);
}
 */

con***REMOVED*** sceneToGeoJSONObject = (scene) => {
    return{
        "type": "Feature",
        "geometry": {
            "type": scene.footprint.type,
            "coordinates": scene.footprint.coordinates
        },
        "properties": {
            "name": scene.name,
            "countrycode": scene.countrycode
        }
    }
}

con***REMOVED*** sceneToGeoJSONCentre = (scene) => {
    let object = {
        "type": "Feature",
        "id": scene.id,
        "name": scene.name,
        "geometry": {
            "type": "Point",
            "coordinates": scene.centre,
            "type": "Polygon",
            "coordinates": scene.footprint.coordinates,
        },
        "properties": {
            "name": scene.name,
            "producturl": scene.producturl,
        }
    }

    return object
}

con***REMOVED*** missionScenesToGeoJson = (mission) => {
    con***REMOVED*** geoJsonScenes = []
    con***REMOVED*** scenes = mission.scenes
    for(let i = scenes.length; --i > -1;){
        geoJsonScenes.push(sceneToGeoJSONObject(scenes[i]))
    }
    return geoJsonScenes
}

con***REMOVED*** renderAllMissions = async () => {
    con***REMOVED*** missions = await loadAllMissionScenes()
    con***REMOVED*** geoJsonMissionScenes = []

    for (let i = missions.length; --i > -1;){
        geoJsonMissionScenes.push(...missionScenesToGeoJson(missions[i]))
    }

    new L.GeoJSON(geoJsonMissionScenes, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<h1>'+feature.properties.name+'</h1><p>country-code: '+feature.properties.countrycode+'</p>');
        }
    }).addTo(map);

}

con***REMOVED*** getLi***REMOVED*** = async () => {
    con***REMOVED*** response = await fetch('./server/servies/missions.js');
    con***REMOVED*** myJson = await response.json();
}

//REMOVE BEFORE COMMIT
con***REMOVED*** ***REMOVED***atus = login("***REMOVED***", ***REMOVED***)
/*renderAllMissions()*/


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);