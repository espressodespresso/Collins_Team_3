import {Router} from 'express'
import {getMissions, getMissionScenes} from '../services/api/missions.js'

const router = new Router()

//Send all missionIds owned by the user
router.get('/missions', getMissions)

//Retrieves all the scenes for  a mission
router.get('/missions/:id', getMissionScenes)


export default router
