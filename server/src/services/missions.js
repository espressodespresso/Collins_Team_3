import {nodeCache} from '../db.js'
import {getMissions, getMissionScenes} from '../modules/discover.js'

con***REMOVED*** getMissionsHandler = async (req, res) => {
    try{
        con***REMOVED*** userTokens = nodeCache.get(req.user.username)
        con***REMOVED*** missions = await getMissions(userTokens)
        res.***REMOVED***atus(missions.***REMOVED***atus).json({data: missions.data})
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
            con***REMOVED*** userTokens = nodeCache.get(req.user.username)
            con***REMOVED*** missionScenesResponse = await getMissionScenes(userTokens, req.params.id)
            res.***REMOVED***atus(missionScenesResponse.***REMOVED***atus).json({data: missionScenesResponse.data})
            
        }catch(e){
            console.error(e)
            res.***REMOVED***atus(500).json({message: "Internal Sever Error"})
        }
    }
}

export {getMissionsHandler, getMissionScenesHandler}