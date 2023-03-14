import {nodeCache} from '../db.js'
import network from '../utils/network.js' 
import {getMissions, getMissionScenes} from '../services/discover.js'

con***REMOVED*** getMissionsHandler = async (req, res) => {
    try{
        con***REMOVED*** missions = await getMissions(req.user)
        res.***REMOVED***atus(200).json({data: missions.data})
    }catch(e){
        console.error(e)
        res.***REMOVED***atus(500).json({message: "Internal Server Error"})
    }
}

con***REMOVED*** getMissionScenesHandler = async (req, res) => {

    if(nodeCache.get(req.params.id) !== undefined){
        res.json({data: nodeCache.get(req.params.id)})
    }else{
        try{
            con***REMOVED*** missionScenesResponse = await getMissionScenes(req.user, req.params.id)
    
            if(missionScenesResponse.***REMOVED***atus === 200){

                con***REMOVED*** scenes = missionScenesResponse.data
                res.json({data: scenes})
            
                }else if(missionScenesResponse.***REMOVED***atus === 404){
                res.***REMOVED***atus(404).json({message: "Mission Not Found"})
                }else{
                res.***REMOVED***atus(500).json({message: "Internal Server Error"})
                }
        }catch(e){
            console.error(e)
            res.***REMOVED***atus(500).json({message: "Internal Sever Error"})
        }
    }
}

export {getMissionsHandler, getMissionScenesHandler}