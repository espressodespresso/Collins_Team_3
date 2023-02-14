import {Router} from 'express'
import dashboardRoutes from "./dashboard.js";

con***REMOVED*** router = Router();
router.use("/dashboard", dashboardRoutes)

export default router