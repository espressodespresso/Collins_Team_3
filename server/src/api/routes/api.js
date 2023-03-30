import {Router} from 'express'
import { handleInputErrors } from '../../modules/inputValidation.js'; 
import { body } from 'express-validator';
import { getScenes, getProducts, updateProducts, getFrames } from '../controllers/products.js'
import { getMissions, getMission, getMissionFootprint } from '../controllers/missions.js';

con***REMOVED*** router = new Router()

router.get('/products/scenes', getScenes)

router.get('/products/frames', getFrames)

router.get('products/updates', updateProducts)

router.po***REMOVED***('/products', body('products').isArray(), handleInputErrors, getProducts)

router.get('/missions', getMissions)

router.get('/missions/:id', getMission)

router.get('/missions/:id/footprint', getMissionFootprint)

export default router
