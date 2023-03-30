import {Router} from 'express'
import {handleErrors} from '../../modules/errorHandler.js'
import { handleInputErrors } from '../../modules/inputValidation.js'; 
import { body } from 'express-validator';
import { getScenes, getProducts, updateProducts, getFrames } from '../controllers/products.js'
import { getMissions, getMission, getMissionFootprint } from '../controllers/missions.js';

con***REMOVED*** router = new Router()

router.get('/products/scenes', getScenes, handleErrors)

router.get('/products/frames', getFrames, handleErrors)

router.get('products/updates', updateProducts, handleErrors)

router.po***REMOVED***('/products', body('products').isArray(), handleInputErrors, getProducts, handleErrors)

router.get('/missions', getMissions, handleErrors)

router.get('/missions/:id', getMission, handleErrors)

router.get('/missions/:id/footprint', getMissionFootprint, handleErrors)

export default router
