import merge from "lodash";
import myCache from "../db.js";
import config from "../config/index.js";
import fetch, {Headers} from "node-fetch";
con***REMOVED*** auth = "Bearer " + encodeURI(config.acces***REMOVED***oken)

export con***REMOVED*** getMission = async (req, res) => {
    let value = myCache.get("missions")
    let id = req.params.id
    if(value === undefined) {
        try {
            con***REMOVED*** getMissionURL = 'https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/' + id
            con***REMOVED*** getMissionResponse = await fetch(getMissionURL, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": auth,
                    "Accept": "*/*"
                })
            })

            if (getMissionResponse.***REMOVED***atus === 200) {
                var mission = await getMissionResponse.json()
                merge.mergeWith(mission, await getMissionFootprint(id))
                let geoJSON = {
                    "type": "Mission", "geometry": {"type": mission.type, "coordinates": mission.coordinates}
                    , "properties": {"name": mission.name, "aircraftTakeOffTime": mission.aircraftTakeOffTime}
                }
                res.json({data:geoJSON})
            } else {
                console.error(getMissionResponse.***REMOVED***atus)
            }
        } catch (e) {
            console.error(e)
        }
    } else {
        res.json({data:value[id]})
    }
}

export con***REMOVED*** getMissions = async (req, res) => {
    let responseJSON;

    try {
        con***REMOVED*** getMissionsURL = 'https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions'

        con***REMOVED*** getMissionsResponse = await fetch(getMissionsURL, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
        })

        if (getMissionsResponse.***REMOVED***atus === 200) {
            responseJSON = await getMissionsResponse.json();
            let missions = responseJSON.missions
            var footprints = {}
            for (let i = 0; i < missions.length; i++) {
                footprints[i] = await getMissionFootprint(missions[i].id)
            }
            merge.mergeWith(missions, footprints)

            var geoJSONFormat = {}
            for (let i = 0; i < missions.length; i++) {
                var currentMission = missions[i]
                geoJSONFormat[currentMission.id] = {
                    "type": "Mission", "geometry": {
                        "type": currentMission.type
                        , "coordinates": currentMission.coordinates
                    }, "properties": {
                        "name": currentMission.name
                        , "aircraftTakeOffTime": currentMission.aircraftTakeOffTime,
                    }
                }
            }

            myCache.set("missions", geoJSONFormat, 10000)
            res.json({data: geoJSONFormat})
        } else {
            console.error(getMissionsResponse.***REMOVED***atus)
        }
    } catch (e) {
        console.error(e)
    }
}

export async function getMissionFootprint(id) {
    con***REMOVED*** getFootprintResponse = await fetch("https://hallam.***REMOVED***.com" +
        "/discover/api/v1/missionfeed/missions/" + id + "/footprint", {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
        }),
    })
    return await getFootprintResponse.json()
}