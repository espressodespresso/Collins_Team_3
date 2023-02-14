import {Router} from 'express'
import {login} from '../services/users.js'
import {body} from 'express-validator'
import { handleInputErrors } from '../modules/inputValidation.js'; 

const router = Router();

router.post('/login', body('username').isString(), body('password').isString(), handleInputErrors, login)

export default router