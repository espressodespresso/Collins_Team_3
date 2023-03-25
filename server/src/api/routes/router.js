import {Router} from 'express'
import apiRoutes from './api.js'
import {loginHandler} from '../../services/users.js'
import {body} from 'express-validator'
import {auth} from "../../modules/auth.js";
import { handleInputErrors } from '../../modules/inputValidation.js'; 
import { login } from '../controllers/login.js'


con***REMOVED*** router = Router();
router.po***REMOVED***('/login', body('username').isString(), body('password').isString(), handleInputErrors, login)
router.use('/api', auth, apiRoutes)

export default router