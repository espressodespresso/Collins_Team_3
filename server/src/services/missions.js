import { sendGET } from './apiRequest.js'
import config from '../config/index.js'

const getMissions = async (req, res) => {
    const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/`
    const apiRes = await sendGET(url, config.accesstoken)
    const userMissions = apiRes.missions

    res.json({data: userMissions})
}

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
            scenes[i].producturl = sceneData.producturl
        }
        res.json({data: scenes})
    }

    const getScenes = async (id) => {
        const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/${id}`
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
        return scenes
    }


export {getMissions, getMissionScenes}