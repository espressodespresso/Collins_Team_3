import {Router} from 'express'
import { handleInputErrors } from '../../modules/inputValidation.js'; 
import { body } from 'express-validator';
import { getScenes, getProducts } from '../controllers/products.js'

con***REMOVED*** router = new Router()

router.get('/products/scenes', getScenes)

router.po***REMOVED***('/products', body('products').isArray(), handleInputErrors, getProducts)


export default router
