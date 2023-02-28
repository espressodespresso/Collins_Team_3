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

            con***REMOVED*** urls = []
            for(let i = userMissions.length; --i > -1;){
                urls.push(`https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${userMissions[i].id}/footprint`)
            }

            con***REMOVED*** footprints = await Promise.all(urls.map(url => {
                return network.get(url, headers)
            }))

            for(let i = 0; i < userMissions.length; i++){
                userMissions[i].footprint = footprints[i].data
            }

            res.json({data: userMissions})

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
        console.log("hit")
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

                    nodeCache.set(req.params.id, scenes[i])
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

export {getMissions, getMissionScenes}