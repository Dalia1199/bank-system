import { Router } from "express";
import * as service from "./transction.service.js";
import { authentication } from "../../common/middlware/authenticaton.js";
import { validation } from "../../common/middlware/validation.js";
import * as schema from "./transction.validation.js";

const router = Router();

router.post("/deposit", authentication, service.deposit);
router.post("/withdraw", authentication, service.withdraw);
router.post("/transfer", authentication, service.transfer);
router.get("/my", authentication, service.getMyTransactions);
router.get("/my/summary", authentication, service.getMySummary);
router.get("/:id", authentication, service.getOneTransaction);

export default router;