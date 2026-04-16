import { Router } from "express";
import * as service from "./auth.service.js";
import { validation } from "../../common/middlware/validation.js";
import * as schema from "./auth.validation.js";

const router = Router();

router.post("/register", validation(schema.registerSchema), service.register);
router.post("/login", validation(schema.loginSchema), service.login);
// console.log(req.body);
export default router;