import {nodeCache} from '../db.js'
import {getMissions, getMissionScenes} from '../modules/discoverClient.js'

const getMissionsHandler = async (req, res) => {
    try{
        const userTokens = nodeCache.get(req.user.username)
        const missions = await getMissions(userTokens)
        res.status(missions.status).json({data: missions.data})
    }catch(e){
        console.error(e)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const getMissionScenesHandler = async (req, res) => {

    if(nodeCache.get(req.params.id) !== undefined){
        res.json({data: nodeCache.get(req.params.id)})
    }else{
        try{
            const userTokens = nodeCache.get(req.user.username)
            const missionScenesResponse = await getMissionScenes(userTokens, req.params.id)
            res.status(missionScenesResponse.status).json({data: missionScenesResponse.data})
            
        }catch(e){
            console.error(e)
            res.status(500).json({message: "Internal Sever Error"})
        }
    }
}

export {getMissionsHandler, getMissionScenesHandler}