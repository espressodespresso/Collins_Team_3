import {nodeCache} from '../db.js'
import {getScenes, getSceneFrames} from '../modules/discover.js'

const getScenesHandler = async(req, res) => {
    try{
        const userTokens = nodeCache.get(req.user.username)
        const scenes = await getScenes(userTokens)
        res.status(scenes.status).json({data: scenes.data})
    }catch(e){
        console.error(e)
        res.status(500).json({message: "Internal server error"})
    }
}

const getSceneFramesHandler = async(req, res) => {
        try{
            const userTokens = nodeCache.get(req.user.username)
            const frames = await getSceneFrames(userTokens, req.params.id)
            res.status(frames.status).json({data: frames.data})
        }catch(e){
        console.error(e)
        res.status(500).json({message: "Internal Server Error"})
        }
    }


export{getScenesHandler, getSceneFramesHandler}