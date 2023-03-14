import {nodeCache} from '../db.js'
import {getScenes, getSceneFrames} from '../modules/discover.js'

con***REMOVED*** getScenesHandler = async(req, res) => {
    try{
        con***REMOVED*** userTokens = nodeCache.get(req.user.username)
        con***REMOVED*** scenes = await getScenes(userTokens)
        res.***REMOVED***atus(scenes.***REMOVED***atus).json({data: scenes.data})
    }catch(e){
        console.error(e)
        res.***REMOVED***atus(500).json({message: "Internal server error"})
    }
}

con***REMOVED*** getSceneFramesHandler = async(req, res) => {
        try{
            con***REMOVED*** userTokens = nodeCache.get(req.user.username)
            con***REMOVED*** frames = await getSceneFrames(userTokens, req.params.id)
            res.***REMOVED***atus(frames.***REMOVED***atus).json({data: frames.data})
        }catch(e){
        console.error(e)
        res.***REMOVED***atus(500).json({message: "Internal Server Error"})
        }
    }


export{getScenesHandler, getSceneFramesHandler}