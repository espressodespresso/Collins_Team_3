import { sendGET } from './apiRequest.js'
import {nodeCache} from '../db.js'
import config from '../config/index.js'

const getMissions = async (req, res) => {
    const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/`
    const apiRes = await sendGET(url, req.accessToken)

    if(apiRes){
        const userMissions = apiRes.missions
        res.json({data: userMissions})

        for(let i = userMissions.length; --i > -1;){
            cacheScenes(userMissions[i].id, req.accessToken)
        }
     }else{
        res.status(500).json({message: "Internal Server Error"})
    }

}

const getMissionScenes = async (req, res) => {

    if(nodeCache.get(req.params.id) === undefined){
        const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/${req.params.id}`
        const apiRes = await sendGET(url, req.accessToken)

        if(apiRes){
            const scenes = apiRes.scenes
    
            for(let i = scenes.length; --i > -1;){
                const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${scenes[i].id}`
                const apiRes = await sendGET(url, req.accessToken)
                const sceneData = apiRes.product.result
    
                delete scenes[i].bands
    
                scenes[i].countrycode = sceneData.countrycode
                scenes[i].centre = sceneData.centre
                scenes[i].footprint = sceneData.footprint
                scenes[i].producturl = sceneData.producturl

                nodeCache.set(scenes[i].id, scenes[i].producturl)
            }
            res.json({data: scenes})
        }else{
            res.status(500).json({message: "Internal Server Error"})
        }
    }else{
        res.json({data: nodeCache.get(req.params.id)})
    }
}

    const cacheScenes = async (id, accessToken) => {
        const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/${id}`
        const apiRes = await sendGET(url, accessToken)
        const scenes = apiRes.scenes

        for(let i = scenes.length; --i > -1;){
            const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${scenes[i].id}`
            const apiRes = await sendGET(url, accessToken)
            const sceneData = apiRes.product.result

            delete scenes[i].bands

            scenes[i].countrycode = sceneData.countrycode
            scenes[i].centre = sceneData.centre
            scenes[i].footprint = sceneData.footprint
        }
        nodeCache.set(id, scenes)
    }


export {getMissions, getMissionScenes}