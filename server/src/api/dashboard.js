import {Router} from 'express'
import config from "../config/index.js";
import fetch, {Headers} from "node-fetch";
import merge from "lodash";
const router = Router()

router.get('/mission', async (req, res) => {
    console.log(await getMissions())
})
router.get('/mission/:id', (req, res) => {
    console.log("mission id:" + req.params.id)
})


const getMissions = async () => {
    let responseJSON;

    try{
        const getMissionsURL = 'https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions'
        const auth = "Bearer " + encodeURI(config.accesstoken)

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
                const getFootprintResponse = await fetch("https://hallam.sci-toolset.com" +
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
            for(let i=0; i < missions.length; i++) {
                merge.mergeWith(missions, footprints)
            }

            return missions
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

export default router