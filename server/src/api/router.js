import {Router} from 'express'
import dashboardRoutes from "./dashboard.js";

const router = Router();
router.use("/dashboard", dashboardRoutes)

export default router