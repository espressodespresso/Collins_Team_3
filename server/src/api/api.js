import {Router} from 'express'
import {getMissionScenes} from '../services/missions.js'

const router = new Router()

//load in scenes for all missions
router.get('/missions/:id', getMissionScenes)

//load in frames for specified scene
router.get('/scene/:id')

export default router
