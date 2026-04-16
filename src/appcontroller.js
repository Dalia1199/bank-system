import connectionDB from "./DB/connectiondb.js";
import authRouter from "./modules/auth/auth.controller.js";
import accountRouter from "./modules/accounts/account.controller.js";
import transactionRouter from "./modules/transction/transction.controller.js";
import summaryRouter from "./modules/summary/summary.controller.js";
import { PORT } from "../conflig/confligservice.js";

import  globalErrorHandler  from "./common/utilities/responce.success.js";
import express from "express";
const port = PORT
const app = express();
const bootstrap = () => {

    app.use(express.json());

    connectionDB();

    
    app.use("/auth", authRouter);
    app.use("/account", accountRouter);
    app.use("/transaction", transactionRouter);
    app.use("/summary", summaryRouter);

   

    app.use("{/*demo}", (req, res, next) => {
        throw new Error(`url ${req.originalUrl}not found`, { cause: 404 })
    }) ;
    app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`server is running on port${port} 😊`)
})
}


export default bootstrap;
