import {json, Router} from 'express'
import config from "../config/index.js";
import fetch, {Headers} from "node-fetch";
import merge from "lodash";
import memcached from "../db.js";
const router = Router()
const auth = "Bearer " + encodeURI(config.accesstoken)

router.get('/missions', async (req, res) => {
    var missions = await getMissions()
    res.send(missions)
    memcached.set("Missions", missions, 10000, await function (err, result) {
        if(err) console.error(err + "hi")
        console.log(result + "result")
    })

    memcached.get("Missions", await function(err,result) {
        if(err) console.error(err)
        console.log(result + "test")
    })
    //console.log(await getMissions())
})
router.get('/:mission', async (req, res) => {
    let id = req.params.mission
    //res.send(await getMission(id))
    console.log("mission id:" + id)
    console.log(await getMission(id))
})

async function checkCache() {
    memcached.get("Missions", await function(err) {
        if(err) return false
        return true
    })
}

const getMission = async (id) => {
    if(await checkCache() === false) {
        console.log("API call")
        try {
            const getMissionURL = 'https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/' + id
            console.log(getMissionURL)
            const getMissionResponse = await fetch(getMissionURL, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": auth,
                    "Accept": "*/*"
                }),
            })

            if (getMissionResponse.status === 200) {
                var mission = await getMissionResponse.json()
                merge.mergeWith(mission, await getMissionFootprint(id))
                let geoJSON = {
                    "type": "Mission", "geometry": {"type": mission.type, "coordinates": mission.coordinates}
                    , "properties": {"name": mission.name, "aircraftTakeOffTime": mission.aircraftTakeOffTime}
                }
                return geoJSON
            } else {
                console.log(statusMessage(getMissionResponse.status))
            }
        } catch (e) {
            console.error(e)
        }
    } else {
        console.log("Getting cached data")
        memcached.get("Missions", async function(err, result) {
            if(err) return null
            console.log("result")
            //console.log(result)
            return result
        })
    }
}

const getMissions = async () => {
    let responseJSON;

    try{
        const getMissionsURL = 'https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions'

        const getMissionsResponse = await fetch(getMissionsURL, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
        })

        if(getMissionsResponse.status === 200) {
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
            return statusMessage(getMissionsResponse.status)
        }
    }catch(e){
        console.error(e)
    }
}

function statusMessage(code) {
    switch (code) {
        case 200:
            return "Ok"
        case 400:
            return "Bad Request"
        case 401:
            return "Unauthorized"
        case 403:
            return "Invalid user credentials"
        default:
            return "?"
    }
}

async function getMissionFootprint(id) {
    const getFootprintResponse = await fetch("https://hallam.sci-toolset.com" +
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