import { sendGET } from './apiRequest.js'
import config from '../config/index.js'

const getFrames = async(req, res) => {
    const url = req.body.producturl
    const apiRes = await sendGET(url, config.accesstoken)
    const frames = apiRes.scenes.bands.frames

    for(let i = frames.length-1; --i > -1;){
        const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${frames[i].id}`
        const apiRes = await sendGET(url, config.accesstoken)
        const frameData = apiRes.product.result

        console.log(frameData)
    }
}

export{getFrames}