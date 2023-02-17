var map = L.map('map', {zoomControl: false}).setView([54.247468, -4.438477], 6);
var layerControl = L.control.layers().addTo(map);
/*var geolayer = new L.GeoJSON(object, {
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<h1>'+feature.properties.id+'</h1><p>name: '+feature.properties.name+'</p><p>producturl: '+feature.producturl);
    }
}).addTo(map);*/


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

const login = async (username, password) => {
    let status = true;
    const loginURL = 'http://localhost:3000/login'
    const res = await fetch(loginURL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username": username, "password": password})
    })
    const resText = await res.text()
    const resJSON = resText === ""? {}: JSON.parse(resText)
    const jwt = resJSON.token
    if(jwt){
        localStorage.jwt = jwt
    }else{
        status = false
    }
    return status
}

/*async function getMissionsRequest() {
    const getMissionsURL = 'http://localhost:3000/api/missions';
    const getMissionsResponse = await fetch(getMissionsURL, {
        method: "GET"
    });
    return await getMissionsResponse.json()
}*/

const getMissionsRequest = async () => {
    const getMissionsURL = 'http://localhost:3000/api/missions'
    const jwt = localStorage.jwt
    const res = await fetch(getMissionsURL, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const resText = await res.text()
    const resJSON = resText === ""? {}: JSON.parse(resText)
    //const missions = resJSON.data

    return resJSON
}


/*async function getMissionRequest(id) {
    const getMissionURL = 'http://localhost:3000/api/missions/' + id;
    const getMissionResponse = await fetch(getMissionURL, {
        method: "GET"
    })
    return await getMissionResponse.json()
}*/

const getMissionRequest = async(id) => {
    const getMissionSceneURL = `http://localhost:3000/api/missions/${id}`
    const jwt = localStorage.jwt
    const res = await fetch(getMissionSceneURL, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const resText = await res.text()
    const resJSON = resText === ""? {}: JSON.parse(resText)
    //const scenes = resJSON.data

    return resJSON;
}

async function getMissions() {
    let value = await getMissionsRequest();
    let missions = [{}]
    try {

        for (let i = 0; i < value.data.length; i++) {
            let valueData = value.data[i]
            let id = valueData.id;
            let mission = await getMissionRequest(id)
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
    const missions = await getMissions()
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
            marks.push(addMarker(missionData[j], mission.missionname, mission.aircraftTakeOffTime))
            //addToGeoLayer(sceneToGeoJSONCentre(missionData[j]))
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

function addToGeoLayer(objectP){
    var workplease = new L.GeoJSON(objectP, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<h1>'+feature.properties.name+'</h1><p>name: '+feature.id+'</p><p>producturl: '+feature.producturl);
        }
    }).addTo(map);
}
const sceneToGeoJSONObject = (scene) => {
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

const missionScenesToGeoJson = (mission) => {
    const geoJsonScenes = []
    const scenes = mission.scenes
    for(let i = scenes.length; --i > -1;){
        geoJsonScenes.push(sceneToGeoJSONObject(scenes[i]))
    }
    return geoJsonScenes
}

const renderAllMissions = async () => {
    const missions = await loadAllMissionScenes()
    const geoJsonMissionScenes = []

    for (let i = missions.length; --i > -1;){
        geoJsonMissionScenes.push(...missionScenesToGeoJson(missions[i]))
    }

    new L.GeoJSON(geoJsonMissionScenes, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<h1>'+feature.properties.name+'</h1><p>country-code: '+feature.properties.countrycode+'</p>');
        }
    }).addTo(map);

}

const getList = async () => {
    const response = await fetch('./server/servies/missions.js');
    const myJson = await response.json();
}

//REMOVE BEFORE COMMIT
const status = login("hallam2", "2513@5De")
/*renderAllMissions()*/


var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);