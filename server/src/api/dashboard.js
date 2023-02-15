import {json, Router} from 'express'
import config from "../config/index.js";
import fetch, {Headers} from "node-fetch";
import merge from "lodash";
import myCache from "../db.js";
con***REMOVED*** router = Router()
con***REMOVED*** auth = "Bearer " + encodeURI(config.acces***REMOVED***oken)

router.get('/missions', async (req, res) => {
    var missions = await getMissions()
    res.send(missions)
    let result = myCache.set("missions", missions, 10000)
    if(result) {
        console.log("Cached successfully")
    } else {
        console.log("Error while caching")
    }
})
router.get('/:mission', async (req, res) => {
    let id = req.params.mission
    res.send(await getMission(id))
})

con***REMOVED*** getMission = async (id) => {
    let value = myCache.get("missions")
    if(value === undefined) {
        console.log("API call")
        try {
            con***REMOVED*** getMissionURL = 'https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/' + id
            console.log(getMissionURL)
            con***REMOVED*** getMissionResponse = await fetch(getMissionURL, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": auth,
                    "Accept": "*/*"
                }),
            })

            if (getMissionResponse.***REMOVED***atus === 200) {
                var mission = await getMissionResponse.json()
                merge.mergeWith(mission, await getMissionFootprint(id))
                let geoJSON = {
                    "type": "Mission", "geometry": {"type": mission.type, "coordinates": mission.coordinates}
                    , "properties": {"name": mission.name, "aircraftTakeOffTime": mission.aircraftTakeOffTime}
                }
                return geoJSON
            } else {
                console.log(***REMOVED***atusMessage(getMissionResponse.***REMOVED***atus))
            }
        } catch (e) {
            console.error(e)
        }
    } else {
        console.log("Getting cached data")
        return value[id]
    }
}

con***REMOVED*** getMissions = async () => {
    let responseJSON;

    try{
        con***REMOVED*** getMissionsURL = 'https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions'

        con***REMOVED*** getMissionsResponse = await fetch(getMissionsURL, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
        })

        if(getMissionsResponse.***REMOVED***atus === 200) {
            responseJSON = await getMissionsResponse.json();
            let missions = responseJSON.missions
            var footprints = {}
            for(let i=0; i < missions.length; i++) {
                footprints[i] = await getMissionFootprint(missions[i].id)
            }
            merge.mergeWith(missions, footprints)

            var geoJSONFormat = {}
            for(let i=0; i < missions.length; i++) {
                var currentMission = missions[i]
                geoJSONFormat[currentMission.id] = {"type":"Mission","geometry":{"type":currentMission.type
                        ,"coordinates":currentMission.coordinates},"properties":{"name":currentMission.name
                        , "aircraftTakeOffTime": currentMission.aircraftTakeOffTime,}}
            }

            return geoJSONFormat
        } else {
            return ***REMOVED***atusMessage(getMissionsResponse.***REMOVED***atus)
        }
    }catch(e){
        console.error(e)
    }
}

function ***REMOVED***atusMessage(code) {
    switch (code) {
        case 200:
            return "Ok"
        case 400:
            return "Bad Reque***REMOVED***"
        case 401:
            return "Unauthorized"
        case 403:
            return "Invalid user credentials"
        default:
            return "?"
    }
}

async function getMissionFootprint(id) {
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

export default router