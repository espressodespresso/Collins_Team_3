import {Router} from 'express'
import dashboardRoutes from "./dashboard.js";
import {login} from '../services/users.js'
import {body} from 'express-validator'
import { handleInputErrors } from '../modules/inputValidation.js'; 


con***REMOVED*** router = Router();
router.use("/dashboard", dashboardRoutes)

router.po***REMOVED***('/login', body('username').isString(), body('password').isString(), handleInputErrors, login)

export default router