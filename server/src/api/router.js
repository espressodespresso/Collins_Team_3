import {Router} from 'express'
import apiRoutes from './api.js'
import {loginHandler} from '../services/users.js'
import {body} from 'express-validator'
import {auth} from "../modules/auth.js";
import { handleInputErrors } from '../modules/inputValidation.js'; 


const router = Router();
router.post('/login', body('username').isString(), body('password').isString(), handleInputErrors, loginHandler)
router.use('/api', auth, apiRoutes)

export default router