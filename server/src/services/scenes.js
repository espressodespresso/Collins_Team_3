import config from "../config/index.js";
import fetch, {Headers} from "node-fetch";

const auth = "Bearer " + encodeURI(config.accesstoken)

export const getScenes = async(req, res) => {
    let mission_id = req.params.mission_id
    try {
        const getMissionURL = 'https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/' + mission_id
        const getMissionResponse = await fetch(getMissionURL, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
        })

        if(getMissionResponse.status === 200) {
            var mission = await getMissionResponse.json()
            res.json({data:mission.scenes})
        } else {
            console.error(getMissionResponse.status)
        }
    } catch (e) {
        console.error(e)
    }
}

export const getScene = async(req, res) => {
    let mission_id = req.params.mission_id
    let scene_id = req.params.scene_id
    try {
        const getSceneURL = 'https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/' + mission_id
            + "/scene/" + scene_id + "/frames"
        const getSceneResponse = await fetch(getSceneURL, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
        })

        if(getSceneResponse.status === 200) {
            var scene = await getSceneResponse.json()
            res.json({data:scene})
        } else {
            console.error(getSceneResponse.status)
        }
    } catch (e) {
        console.error(e)
    }
}