import Joi from "joi";

export const createAccountSchema = {
    body: Joi.object({
        accountType: Joi.string().valid("current", "saving").optional()
    })
};