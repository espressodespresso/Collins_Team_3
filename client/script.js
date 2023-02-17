var map = L.map('map', {zoomControl: false}).setView([54.247468, -4.438477], 6);

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


con***REMOVED*** getMissions = async () => {
  con***REMOVED*** getMissionsURL = 'http://localho***REMOVED***:3000/api/missions'
  con***REMOVED*** jwt = localStorage.jwt
  con***REMOVED*** res = await fetch(getMissionsURL, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
  con***REMOVED*** resText = await res.text()
  con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
  con***REMOVED*** missions = resJSON.data

  return missions
}


con***REMOVED*** getMissionScene = async(id) => {
  con***REMOVED*** getMissionSceneURL = `http://localho***REMOVED***:3000/api/missions/${id}`
  con***REMOVED*** jwt = localStorage.jwt
  con***REMOVED*** res = await fetch(getMissionSceneURL, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
  con***REMOVED*** resText = await res.text()
  con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
  con***REMOVED*** scenes = resJSON.data

  return scenes;
}

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

con***REMOVED*** loadAllMissionScenes = async() => {
  con***REMOVED*** missions = await getMissions()
  for(let i = missions.length; --i > -1;){
    missions[i].scenes = await getMissionScene(missions[i].id)
  }
  return missions
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


//REMOVE BEFORE COMMIT
con***REMOVED*** ***REMOVED***atus = login("usr", "pass")
renderAllMissions()

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);