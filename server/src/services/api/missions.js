import { sendGET } from '../apiReque***REMOVED***.js'
import config from '../config/index.js'

con***REMOVED*** getMissionScenes = async (req, res) => {

    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${req.params.id}`
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
        res.json({data: scenes})
    }

export {getMissionScenes}