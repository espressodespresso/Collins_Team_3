import {Router} from 'express'
import { getScenes, getProducts } from '../controllers/products.js'

const router = new Router()

router.get('/products/scenes', getScenes)

router.post('/products', getProducts)


export default router
