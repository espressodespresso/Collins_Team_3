import { Router } from 'express'
import { login } from '../services/users.js'

con***REMOVED*** router = Router()

router.po***REMOVED***('/login', login)

export default router