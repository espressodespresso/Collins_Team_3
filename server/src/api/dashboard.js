import {json, Router} from 'express'
import {getMissions, getMission} from "../services/missions.js"
con***REMOVED*** router = Router()

// Mission routes
router.get('/missions', getMissions)
router.get("/mission/:id", getMission)

export default router