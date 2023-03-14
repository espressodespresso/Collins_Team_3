import {Router} from 'express'
import apiRoutes from './api.js'
import {login} from '../handlers/users.js'
import {body} from 'express-validator'
import {auth} from "../modules/auth.js";
import { handleInputErrors } from '../modules/inputValidation.js'; 


con***REMOVED*** router = Router();
router.po***REMOVED***('/login', body('username').isString(), body('password').isString(), handleInputErrors, login)
router.use('/api', auth, apiRoutes)

export default router