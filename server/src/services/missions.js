import merge from "lodash";
import myCache from "../db.js";
import config from "../config/index.js";
import fetch, {Headers} from "node-fetch";
const auth = "Bearer " + encodeURI(config.accesstoken)

export const getMission = async (req, res) => {
    let value = myCache.get("missions")
    let id = req.params.id
    if(value === undefined) {
        try {
            const getMissionURL = 'https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/' + id
            const getMissionResponse = await fetch(getMissionURL, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": auth,
                    "Accept": "*/*"
                })
            })

            if (getMissionResponse.status === 200) {
                var mission = await getMissionResponse.json()
                merge.mergeWith(mission, await getMissionFootprint(id))
                let geoJSON = {
                    "type": "Mission", "geometry": {"type": mission.type, "coordinates": mission.coordinates}
                    , "properties": {"name": mission.name, "aircraftTakeOffTime": mission.aircraftTakeOffTime}
                }
                res.json({data:geoJSON})
            } else {
                console.error(getMissionResponse.status)
            }
        } catch (e) {
            console.error(e)
        }
    } else {
        res.json({data:value[id]})
    }
}

export const getMissions = async (req, res) => {
    let responseJSON;

    try {
        const getMissionsURL = 'https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions'

        const getMissionsResponse = await fetch(getMissionsURL, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
        })

        if (getMissionsResponse.status === 200) {
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
            console.error(getMissionsResponse.status)
        }
    } catch (e) {
        console.error(e)
    }
}

export async function getMissionFootprint(id) {
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