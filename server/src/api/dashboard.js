import {json, Router} from 'express'
import {getMissions, getMission} from "../services/missions.js"
import {getScene, getScenes} from "../services/scenes.js";

const router = Router()

// Mission routes
router.get('/missions', getMissions)
router.get("/mission/:id", getMission)
router.get("/mission/:mission_id/scene/:scene_id", getScene)
router.get("/mission/:mission_id/scenes", getScenes)

export default router