import {Router} from 'express'
import apiRoutes from './api.js'
import {body} from 'express-validator'
import {auth} from "../../modules/auth.js";
import { handleInputErrors } from '../../modules/inputValidation.js'; 
import { login } from '../controllers/users.js'


const router = Router();
router.post('/login', body('username').isString(), body('password').isString(), handleInputErrors, login)
router.use('/api', auth, apiRoutes)

export default router