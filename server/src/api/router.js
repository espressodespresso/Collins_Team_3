import {Router} from 'express'
import dashboardRoutes from "./dashboard.js";
import {login} from '../services/users.js'
import {body} from 'express-validator'
import {auth} from "../modules/auth.js";
import { handleInputErrors } from '../modules/inputValidation.js'; 


const router = Router();
router.use("/dashboard", dashboardRoutes)

router.post('/login', body('username').isString(), body('password').isString(), handleInputErrors, login)

export default router