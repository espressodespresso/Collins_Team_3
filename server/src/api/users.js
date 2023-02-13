import { Router } from 'express'

const router = Router()

router.get('/login', async (req, res) => {
    res.json({message: 'hello users'})
})

export default router