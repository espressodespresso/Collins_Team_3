import {Router} from 'express'
import { getScenes, getProducts } from '../controllers/products.js'

con***REMOVED*** router = new Router()

router.get('/products/scenes', getScenes)

router.po***REMOVED***('/products', getProducts)


export default router
