import { sendGET } from '../apiRequest.js'
import config from '../config/index.js'

const getMissionScenes = async (req, res) => {

    const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/${req.params.id}`
    const apiRes = await sendGET(url, config.accesstoken)
    const scenes = apiRes.scenes

    for(let i = scenes.length-1; --i > -1;){
            const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${scenes[i].id}`
            const apiRes = await sendGET(url, config.accesstoken)
            const sceneData = apiRes.product.result

            delete scenes[i].bands

            scenes[i].countrycode = sceneData.countrycode
            scenes[i].centre = sceneData.centre
            scenes[i].footprint = sceneData.footprint
        }
        res.json({data: scenes})
    }

export {getMissionScenes}