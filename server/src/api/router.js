import {Router} from 'express'
import userRoutes from './users.js'

con***REMOVED*** router = Router();

router.use('/users', userRoutes)

export default router