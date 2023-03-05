import {Router} from 'express'
import {getSceneFrames, getScenes} from '../services/scenes.js'
import {getMissions, getMissionScenes} from '../services/missions.js'

const router = new Router()

//Send all missionIds owned by the user
router.get('/missions', getMissions)

//Retrieves all the scenes for  a mission
router.get('/missions/:id', getMissionScenes)

//Gets all scenes for every mission
router.get('/scenes', getScenes)

//Retrieves all frames for a scene
router.get('/scenes/:id', getSceneFrames)


export default router
