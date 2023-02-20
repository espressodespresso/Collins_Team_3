import {nodeCache} from '../db.js'
import network from '../utils/network.js'

con***REMOVED*** getMissions = async (req, res) => {

    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/`
    con***REMOVED*** auth = `Bearer ${encodeURI(req.accessToken)}`
    con***REMOVED*** headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }
    
    try{
        con***REMOVED*** apiRes = await network.get(url, headers)

        if(apiRes.***REMOVED***atus === 200){
            con***REMOVED*** userMissions = apiRes.data.missions
            res.json({data: userMissions})
    
            for(let i = userMissions.length; --i > -1;){
                cacheScenes(userMissions[i].id, req.accessToken)
            }
         }else{
            res.***REMOVED***atus(500).json({message: "Internal Server Error"})
        }
    }catch(e){
        console.error(e)
        res.***REMOVED***atus(500).json({message: "Internal Server Error"})
    }

}

con***REMOVED*** getMissionScenes = async (req, res) => {

    if(nodeCache.get(req.params.id) !== undefined){
        res.json({data: nodeCache.get(req.params.id)})
    }else{
        try{
            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${req.params.id}`
            con***REMOVED*** auth = `Bearer ${encodeURI(req.accessToken)}`
            con***REMOVED*** headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }
    
            con***REMOVED*** apiRes = await network.get(url, headers)
    
            if(apiRes.***REMOVED***atus === 200){
                con***REMOVED*** scenes = apiRes.data.scenes
        
                for(let i = scenes.length; --i > -1;){
                    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${scenes[i].id}`
                    con***REMOVED*** auth = `Bearer ${encodeURI(req.accessToken)}`
                    con***REMOVED*** headers = {
                        "Content-Type": "application/json",
                        "Authorization": auth,
                        "Accept": "*/*"
                    }
    
                    con***REMOVED*** apiRes = await network.get(url, headers)
    
                    if(apiRes.***REMOVED***atus === 200){
                        con***REMOVED*** sceneData = apiRes.data.product.result
        
                        delete scenes[i].bands
                    
                        scenes[i].name = sceneData.title
                        scenes[i].countrycode = sceneData.countrycode
                        scenes[i].centre = sceneData.centre
                        scenes[i].footprint = sceneData.footprint
                        scenes[i].producturl = sceneData.producturl
    
                        nodeCache.set(scenes[i].id, scenes[i].producturl)
                    }else{
                        throw error("Couldn't get all scenes")
                    }
                }
                res.json({data: scenes})
            }
            else if(apiRes.***REMOVED***atus === 404){
                res.***REMOVED***atus(404).json({message: "Mission Not Found"})
            }
            else{
                res.***REMOVED***atus(500).json({message: "Internal Server Error"})
            }
        }catch(e){
            console.error(e)
            res.***REMOVED***atus(500).json({message: "Internal Sever Error"})
        }
    }
}

    con***REMOVED*** cacheScenes = async (id, accessToken) => {
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${id}`
        con***REMOVED*** auth = `Bearer ${encodeURI(accessToken)}`
        con***REMOVED*** headers = {
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
        }

        try{
            con***REMOVED*** apiRes = await network.get(url, headers)

            if(apiRes.***REMOVED***atus === 200){
                con***REMOVED*** scenes = apiRes.data.scenes

                for(let i = scenes.length; --i > -1;){
                    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${scenes[i].id}`
                    con***REMOVED*** auth = `Bearer ${encodeURI(accessToken)}`
                    con***REMOVED*** headers = {
                        "Content-Type": "application/json",
                        "Authorization": auth,
                        "Accept": "*/*"
                    }
                    con***REMOVED*** apiRes = await network.get(url, headers)
                    con***REMOVED*** sceneData = apiRes.data.product.result
        
                    delete scenes[i].bands
        
                    scenes[i].countrycode = sceneData.countrycode
                    scenes[i].centre = sceneData.centre
                    scenes[i].footprint = sceneData.footprint
                }
                nodeCache.set(id, scenes)
            }else{
                return null
            }
        }catch(e){
            console.error(e)
            return null
        }
    }

        


export {getMissions, getMissionScenes}