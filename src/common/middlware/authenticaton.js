

import jwt from "jsonwebtoken";
import userModel from "../../DB/models/usermodel.js";

export const authentication = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization)
            return next(new Error("Token required", { cause: 401 }));

        const [prefix, token] = authorization.split(" ");

        if (prefix !== "Bearer")
            return next(new Error("Invalid token prefix", { cause: 401 }));

        const decoded = jwt.verify(token, "secret");

        if (!decoded?.id)
            return next(new Error("Invalid token", { cause: 401 }));

        const user = await userModel.findById(decoded.id);

        if (!user)
            return next(new Error("User not found", { cause: 404 }));

        req.user = user;

        next();
    } catch (err) {
        return next(new Error("Authentication failed", { cause: 401 }));
    }
};