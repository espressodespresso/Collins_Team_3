import { sendGET } from './apiReque***REMOVED***.js'
import {nodeCache} from '../db.js'
import config from '../config/index.js'

con***REMOVED*** getMissions = async (req, res) => {
    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/`
    con***REMOVED*** apiRes = await sendGET(url, req.accessToken)

    if(apiRes){
        con***REMOVED*** userMissions = apiRes.missions
        res.json({data: userMissions})

        for(let i = userMissions.length; --i > -1;){
            cacheScenes(userMissions[i].id, req.accessToken)
        }
     }else{
        res.***REMOVED***atus(500).json({message: "Internal Server Error"})
    }

}

con***REMOVED*** getMissionScenes = async (req, res) => {

    if(nodeCache.get(req.params.id) === undefined){
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${req.params.id}`
        con***REMOVED*** apiRes = await sendGET(url, req.accessToken)

        if(apiRes){
            con***REMOVED*** scenes = apiRes.scenes
    
            for(let i = scenes.length; --i > -1;){
                con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${scenes[i].id}`
                con***REMOVED*** apiRes = await sendGET(url, req.accessToken)
                con***REMOVED*** sceneData = apiRes.product.result
    
                delete scenes[i].bands
                
                scenes[i].name = sceneData.name
                scenes[i].countrycode = sceneData.countrycode
                scenes[i].centre = sceneData.centre
                scenes[i].footprint = sceneData.footprint
                scenes[i].producturl = sceneData.producturl

                nodeCache.set(scenes[i].id, scenes[i].producturl)
            }
            res.json({data: scenes})
        }else{
            res.***REMOVED***atus(500).json({message: "Internal Server Error"})
        }
    }else{
        res.json({data: nodeCache.get(req.params.id)})
    }
}

    con***REMOVED*** cacheScenes = async (id, accessToken) => {
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${id}`
        con***REMOVED*** apiRes = await sendGET(url, accessToken)
        con***REMOVED*** scenes = apiRes.scenes

        for(let i = scenes.length; --i > -1;){
            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${scenes[i].id}`
            con***REMOVED*** apiRes = await sendGET(url, accessToken)
            con***REMOVED*** sceneData = apiRes.product.result

            delete scenes[i].bands

            scenes[i].countrycode = sceneData.countrycode
            scenes[i].centre = sceneData.centre
            scenes[i].footprint = sceneData.footprint
        }
        nodeCache.set(id, scenes)
    }


export {getMissions, getMissionScenes}