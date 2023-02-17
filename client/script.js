var map = L.map('map', {zoomControl: false}).setView([54.247468, -4.438477], 6);

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


const getMissions = async () => {
  const getMissionsURL = 'http://localhost:3000/api/missions'
  const jwt = localStorage.jwt
  const res = await fetch(getMissionsURL, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
  const resText = await res.text()
  const resJSON = resText === ""? {}: JSON.parse(resText)
  const missions = resJSON.data

  return missions
}


const getMissionScene = async(id) => {
  const getMissionSceneURL = `http://localhost:3000/api/missions/${id}`
  const jwt = localStorage.jwt
  const res = await fetch(getMissionSceneURL, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
  const resText = await res.text()
  const resJSON = resText === ""? {}: JSON.parse(resText)
  const scenes = resJSON.data

  return scenes;
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

const loadAllMissionScenes = async() => {
  const missions = await getMissions()
  for(let i = missions.length; --i > -1;){
    missions[i].scenes = await getMissionScene(missions[i].id)
  }
  return missions
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


//REMOVE BEFORE COMMIT
const status = login("usr", "pass")
renderAllMissions()

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);