import {Router} from 'express'
import {getSceneFrames, getScenes} from '../handlers/scenes.js'
import {getMissionsHandler, getMissionScenesHandler} from '../handlers/missions.js'

const router = new Router()

//Send all missionIds owned by the user
router.get('/missions', getMissionsHandler)

//Retrieves all the scenes for  a mission
router.get('/missions/:id', getMissionScenesHandler)

//Gets all scenes for every mission
router.get('/scenes', getScenes)

//Retrieves all frames for a scene
router.get('/scenes/:id', getSceneFrames)


export default router
