import {Router} from 'express'
import { handleInputErrors } from '../../modules/inputValidation.js'; 
import { body } from 'express-validator';
import { getScenes, getProducts } from '../controllers/products.js'

const router = new Router()

router.get('/products/scenes', getScenes)

router.post('/products', body('products').isArray(), handleInputErrors, getProducts)


export default router
