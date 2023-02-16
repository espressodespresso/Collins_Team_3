import {Router} from 'express'
import {getFrames} from '../services/api/frames.js'
import {getMissions, getMissionScenes} from '../services/api/missions.js'

con***REMOVED*** router = new Router()

//Send all missionIds owned by the user
router.get('/missions', getMissions)

//Retrieves all the scenes for  a mission
router.get('/missions/:id', getMissionScenes)

//Retrieves all frames for a scene
router.get('/scenes/:id', getFrames)


export default router
