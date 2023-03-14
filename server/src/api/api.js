import {Router} from 'express'
import {getSceneFramesHandler, getScenesHandler} from '../services/scenes.js'
import {getMissionsHandler, getMissionScenesHandler} from '../services/missions.js'

const router = new Router()

//Send all missionIds owned by the user
router.get('/missions', getMissionsHandler)

//Retrieves all the scenes for  a mission
router.get('/missions/:id', getMissionScenesHandler)

//Gets all scenes for every mission
router.get('/scenes', getScenesHandler)

//Retrieves all frames for a scene
router.get('/scenes/:id', getSceneFramesHandler)


export default router
