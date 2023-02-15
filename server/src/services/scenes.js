import config from "../config/index.js";
import fetch, {Headers} from "node-fetch";

con***REMOVED*** auth = "Bearer " + encodeURI(config.acces***REMOVED***oken)

export con***REMOVED*** getScenes = async(req, res) => {
    let mission_id = req.params.mission_id
    try {
        con***REMOVED*** getMissionURL = 'https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/' + mission_id
        con***REMOVED*** getMissionResponse = await fetch(getMissionURL, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
        })

        if(getMissionResponse.***REMOVED***atus === 200) {
            var mission = await getMissionResponse.json()
            res.json({data:mission.scenes})
        } else {
            console.error(getMissionResponse.***REMOVED***atus)
        }
    } catch (e) {
        console.error(e)
    }
}

export con***REMOVED*** getScene = async(req, res) => {
    let mission_id = req.params.mission_id
    let scene_id = req.params.scene_id
    try {
        con***REMOVED*** getSceneURL = 'https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/' + mission_id
            + "/scene/" + scene_id + "/frames"
        con***REMOVED*** getSceneResponse = await fetch(getSceneURL, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
        })

        if(getSceneResponse.***REMOVED***atus === 200) {
            var scene = await getSceneResponse.json()
            res.json({data:scene})
        } else {
            console.error(getSceneResponse.***REMOVED***atus)
        }
    } catch (e) {
        console.error(e)
    }
}