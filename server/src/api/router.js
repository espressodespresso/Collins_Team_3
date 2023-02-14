import {Router} from 'express'
import {login} from '../services/users.js'

const router = Router();

router.post('/login', login)

export default router