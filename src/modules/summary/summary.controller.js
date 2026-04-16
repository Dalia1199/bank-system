import { Router } from "express";
import * as service from "./summary.service.js";
import { authentication } from "../../common/middlware/authenticaton.js";

const router = Router();

router.get("/:accountId", authentication, service.getAccountSummary);

export default router;