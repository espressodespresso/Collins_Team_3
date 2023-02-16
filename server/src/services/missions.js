import { sendGET } from './apiReque***REMOVED***.js'
import config from '../config/index.js'

con***REMOVED*** getMissions = async (req, res) => {
    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/`
    con***REMOVED*** apiRes = await sendGET(url, config.acces***REMOVED***oken)
    con***REMOVED*** userMissions = apiRes.missions

    res.json({data: userMissions})
}

con***REMOVED*** getMissionScenes = async (req, res) => {

    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${req.params.id}`
    con***REMOVED*** apiRes = await sendGET(url, config.acces***REMOVED***oken)
    con***REMOVED*** scenes = apiRes.scenes

    for(let i = scenes.length-1; --i > -1;){
            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${scenes[i].id}`
            con***REMOVED*** apiRes = await sendGET(url, config.acces***REMOVED***oken)
            con***REMOVED*** sceneData = apiRes.product.result

            console.log(sceneData)

            delete scenes[i].bands

            scenes[i].countrycode = sceneData.countrycode
            scenes[i].centre = sceneData.centre
            scenes[i].footprint = sceneData.footprint
            scenes[i].producturl = sceneData.producturl
        }
        res.json({data: scenes})
    }

    con***REMOVED*** getScenes = async (id) => {
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${id}`
        con***REMOVED*** apiRes = await sendGET(url, config.acces***REMOVED***oken)
        con***REMOVED*** scenes = apiRes.scenes

        for(let i = scenes.length-1; --i > -1;){
            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${scenes[i].id}`
            con***REMOVED*** apiRes = await sendGET(url, config.acces***REMOVED***oken)
            con***REMOVED*** sceneData = apiRes.product.result

            delete scenes[i].bands

            scenes[i].countrycode = sceneData.countrycode
            scenes[i].centre = sceneData.centre
            scenes[i].footprint = sceneData.footprint
        }
        return scenes
    }


export {getMissions, getMissionScenes}