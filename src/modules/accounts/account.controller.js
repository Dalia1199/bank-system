import { Router } from "express";
import * as service from "./account.service.js";
import { authentication } from "../../common/middlware/authenticaton.js";

const router = Router();

router.get(
    "/",
    authentication,
    service.getUserAccounts
);

router.post(
    "/create",
    authentication,
    service.createExtraAccount
);
router.get(
    "/me",
    authentication,
    service.getMyAccount
);
export default router;