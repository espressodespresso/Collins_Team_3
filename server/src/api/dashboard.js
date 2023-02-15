import {Router} from 'express'
import config from "../config/index.js";
import fetch, {Headers} from "node-fetch";
import merge from "lodash";
con***REMOVED*** router = Router()

router.get('/mission', async (req, res) => {
    res.send(await getMissions())
    //console.log(await getMissions())
})
router.get('/mission/:id', (req, res) => {
    console.log("mission id:" + req.params.id)
})


con***REMOVED*** getMissions = async () => {
    let responseJSON;

    try{
        con***REMOVED*** getMissionsURL = 'https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions'
        con***REMOVED*** auth = "Bearer " + encodeURI(config.acces***REMOVED***oken)

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
                con***REMOVED*** getFootprintResponse = await fetch("https://hallam.***REMOVED***.com" +
                "/discover/api/v1/missionfeed/missions/" + missions[i].id + "/footprint", {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": auth,
                        "Accept": "*/*"
                    }),
                })
                footprints[i] = await getFootprintResponse.json()
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

export default router