import {nodeCache} from '../db.js'
import network from '../utils/network.js' 
import {getMissions, getMissionScenes} from '../services/discover.js'

const getMissionsHandler = async (req, res) => {
    try{
        const missions = await getMissions(req.user)
        res.status(200).json({data: missions})
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
            const missionScenesResponse = await getMissionScenes(req.user, req.params.id)
    
            if(missionScenesResponse.status === 200){

                const scenes = missionScenesResponse.data
                res.json({data: scenes})
            
                }else if(missionScenesResponse.status === 404){
                res.status(404).json({message: "Mission Not Found"})
                }else{
                res.status(500).json({message: "Internal Server Error"})
                }
        }catch(e){
            console.error(e)
            res.status(500).json({message: "Internal Sever Error"})
        }
    }
}

export {getMissionsHandler, getMissionScenesHandler}