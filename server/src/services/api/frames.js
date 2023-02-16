import { sendGET } from '../apiReque***REMOVED***.js'
import config from '../../config/index.js'

con***REMOVED*** getFrames = async(req, res) => {
    con***REMOVED*** url = req.body.producturl
    con***REMOVED*** apiRes = await sendGET(url, config.acces***REMOVED***oken)
    con***REMOVED*** frames = apiRes.scenes.bands.frames

    for(let i = frames.length-1; --i > -1;){
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${frames[i].id}`
        con***REMOVED*** apiRes = await sendGET(url, config.acces***REMOVED***oken)
        con***REMOVED*** frameData = apiRes.product.result

        console.log(frameData)
    }
}

export{getFrames}