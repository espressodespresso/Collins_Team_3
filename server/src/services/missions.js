import {nodeCache} from '../db.js'
import network from '../utils/network.js'
import {Worker} from 'worker_threads'

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

            //for(let i = userMissions.length; --i > -1;){
            //   await cacheMissionScenes(userMissions[i].id, req.accessToken)
            //}
           

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
                
                con***REMOVED*** urls = []
                con***REMOVED*** auth = `Bearer ${encodeURI(req.accessToken)}`
                con***REMOVED*** headers = {
                    "Content-Type": "application/json",
                    "Authorization": auth,
                    "Accept": "*/*"
                }

                for(let i = scenes.length; --i > -1;){
                    urls.push(`https://hallam.***REMOVED***.com/discover/api/v1/products/${scenes[i].id}`)
                }

    
                con***REMOVED*** apiResponses = await Promise.all(urls.map(url => {
                    return network.get(url, headers)
                }))

                con***REMOVED*** sceneData = apiResponses.map(apiRes => {
                    return apiRes.data.product.result
                })

                for(let i = scenes.length; --i > -1;){
                    delete scenes[i].bands
                    scenes[i].name = sceneData[i].title
                    scenes[i].countrycode = sceneData[i].countrycode
                    scenes[i].centre = sceneData[i].centre
                    scenes[i].footprint = sceneData[i].footprint
                    scenes[i].producturl = sceneData[i].producturl

                    nodeCache.set(scenes[i].id, scenes[i].producturl)
                }
                res.json({data: scenes})
            
                }else if(apiRes.***REMOVED***atus === 404){
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

con***REMOVED*** cacheMissionScenes = async (id, accessToken) => {
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

            con***REMOVED*** urls = []
            con***REMOVED*** auth = `Bearer ${encodeURI(accessToken)}`
            con***REMOVED*** headers = {
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
            }

        for(let i = scenes.length; --i > -1;){
            urls.push(`https://hallam.***REMOVED***.com/discover/api/v1/products/${scenes[i].id}`)
        }


        con***REMOVED*** apiResponses = await Promise.all(urls.map(url => {
            return network.get(url, headers)
        }))

        con***REMOVED*** sceneData = apiResponses.map(apiRes => {
            return apiRes.data.product.result
        })

        for(let i = scenes.length; --i > -1;){
            delete scenes[i].bands
            scenes[i].name = sceneData[i].title
            scenes[i].countrycode = sceneData[i].countrycode
            scenes[i].centre = sceneData[i].centre
            scenes[i].footprint = sceneData[i].footprint
            scenes[i].producturl = sceneData[i].producturl

            nodeCache.set(id, scenes)
        }

        return true 

        }else{
            return false
        }
    }catch(e){
        console.error(e)
        return false
    }
}

export {getMissions, getMissionScenes}